// This file will contain all the logic of the routes

import {
  ControllerError,
  ControllerResponse,
  ResponseFactory,
} from "../../toolkit";
import { IPostModelWithId } from "../posts/posts.models";
import PurchasesDal from "./purchases.dal";
import {
  CheckoutSessionResponse,
  IPurchaseModel,
  IPurchaseModelWithId,
  PaymentStatus,
  UpdatePurchaseBody,
} from "./purchases.models";
import Stripe from "stripe";
import { config } from "../../config";
import mongoose from "mongoose";
import { Request as ExpressRequest } from "express";

const stripe = new Stripe(config.stripeKey, {
  apiVersion: "2022-11-15",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret: string;
// endpointSecret =
//   "whsec_975c17322a7d86a8e6aa4e6d0215132e603a565dbaabbd09eb6f1589d996bf39";

export default class PurchasesService {
  public static async getPurchasesList(): Promise<
    ControllerResponse<IPurchaseModel[] | ControllerError>
  > {
    const purchases = await PurchasesDal.getPurchasesList();
    if (!purchases) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(purchases);
  }

  public static async getPurchaseById(
    purchaseId: string
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    const user = await PurchasesDal.getPurchaseById(purchaseId);
    if (!user) {
      return ResponseFactory.createNotFoundError();
    }

    return ResponseFactory.createResponse(user);
  }

  public static async addPurchase(
    purchaseDetails: IPurchaseModel
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    // verify if the postId is already bought by someone else

    const newPurchase = await PurchasesDal.addNewPurchase({
      ...purchaseDetails,
    });

    if (newPurchase) {
      return ResponseFactory.createResponse(newPurchase);
    }

    return ResponseFactory.createInternalServerError();
  }

  public static async updatePurchase(
    purchaseDetails: UpdatePurchaseBody,
    purchaseId: string
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    for (const property in purchaseDetails) {
      if (!purchaseDetails[property as keyof UpdatePurchaseBody]) {
        delete purchaseDetails[property as keyof UpdatePurchaseBody];
      }
    }
    const purchaseUpdated = await PurchasesDal.updatePurchase(
      purchaseId,
      purchaseDetails
    );
    if (!purchaseUpdated) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(purchaseUpdated);
  }

  public static async deletePurchase(
    purchaseId: string
  ): Promise<ControllerResponse<IPurchaseModel | ControllerError>> {
    const purchase = await PurchasesDal.deletePurchase(purchaseId);

    if (!purchase) {
      return ResponseFactory.createNotFoundError();
    }

    return ResponseFactory.createResponse(purchase);
  }

  public static async createCheckoutSession(
    userId: string,
    userEmail: string,
    post: IPostModelWithId
  ): Promise<ControllerResponse<CheckoutSessionResponse | ControllerError>> {
    const newPurchase = await PurchasesDal.addNewPurchase({
      postId: new mongoose.Types.ObjectId(post._id),
      userId: new mongoose.Types.ObjectId(userId),
      status: PaymentStatus.PENDING,
    });

    if (!newPurchase) {
      return ResponseFactory.createBadRequestError();
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId: userId.toString(),
        purchaseId: newPurchase._id.toString(),
        postId: post._id,
      },
      email: userEmail,
    });

    console.log(`${config.urlBackend}/images/posts/${post.picture}`);
    console.log(customer);
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["RO"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "ron" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "ron" },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: "RON",
            product_data: {
              name: post.title,
              //images: [`${config.urlBackend}/images/posts/${post.picture}`],
              description: post.description,
              metadata: {
                id: post._id,
                size: post.size,
                brand: post.brand,
              },
            },
            unit_amount: post.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${config.clientUrl}/checkout-success`,
      cancel_url: `${config.clientUrl}/main`,
    });

    if (!session || !session.url) {
      return ResponseFactory.createInternalServerError();
    }

    return ResponseFactory.createResponse({ url: session.url });
  }

  public static async stripeWebhook(
    req: any
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    console.log("WEBHOOOOK");
    // Verify if the event comes from Stripe
    const sig = req.headers["stripe-signature"];

    let data: any;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
        console.log("Webhook verified.");
      } catch (err: any) {
        console.log(`Webhook Error: ${err.message}`);
        return ResponseFactory.createBadRequestError(
          `Webhook Error: ${err.message}`
        );
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event

    let updatedPurchase;

    if (eventType === "checkout.session.completed") {
      try {
        console.log(data);

        const customer: any = await stripe.customers.retrieve(data.customer);

        console.log("Metadata");
        console.log(customer.metadata);
        const purchaseId = customer.metadata.purchaseId;
        const customerId = data.customer;
        const paymentIntentId = data.payment_intent;
        const totalPrice = data.amount_total;
        const shipping = data.customer_details;

        // update Purchase
        updatedPurchase = await PurchasesDal.updatePurchase(purchaseId, {
          customerId,
          paymentIntentId,
          totalPrice,
          shipping,
          status: PaymentStatus.COMPLETED,
        });

        if (!updatedPurchase) {
          return ResponseFactory.createBadRequestError();
        }

        // update the Post too and set the isActive field to false

        return ResponseFactory.createResponse(updatedPurchase);
      } catch (error: any) {
        console.log(error);
        return ResponseFactory.createInternalServerError();
      }
    } else if (
      eventType === "checkout.session.async_payment_failed" ||
      eventType === "checkout.session.expired"
    ) {
      console.log("Event failed!!");
      console.log(data);
      //update
      // updatedPurchase = await PurchasesDal.updatePurchase(purchaseId, {
      //   customerId,
      //   paymentIntentId,
      //   totalPrice,
      //   status: PaymentStatus.FAILED,
      // });
    }
    return ResponseFactory.createInternalServerError();
  }
}
