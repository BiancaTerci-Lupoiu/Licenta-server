"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("../../toolkit");
const purchases_dal_1 = __importDefault(require("./purchases.dal"));
const purchases_models_1 = require("./purchases.models");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../config");
const mongoose_1 = __importDefault(require("mongoose"));
const stripe = new stripe_1.default(config_1.config.stripeKey, {
    apiVersion: "2022-11-15",
});
let endpointSecret;
class PurchasesService {
    static getPurchasesList() {
        return __awaiter(this, void 0, void 0, function* () {
            const purchases = yield purchases_dal_1.default.getPurchasesList();
            if (!purchases) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(purchases);
        });
    }
    static getPurchaseById(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield purchases_dal_1.default.getPurchaseById(purchaseId);
            if (!user) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(user);
        });
    }
    static addPurchase(purchaseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPurchase = yield purchases_dal_1.default.addNewPurchase(Object.assign({}, purchaseDetails));
            if (newPurchase) {
                return toolkit_1.ResponseFactory.createResponse(newPurchase);
            }
            return toolkit_1.ResponseFactory.createInternalServerError();
        });
    }
    static updatePurchase(purchaseDetails, purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const property in purchaseDetails) {
                if (!purchaseDetails[property]) {
                    delete purchaseDetails[property];
                }
            }
            const purchaseUpdated = yield purchases_dal_1.default.updatePurchase(purchaseId, purchaseDetails);
            if (!purchaseUpdated) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(purchaseUpdated);
        });
    }
    static deletePurchase(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const purchase = yield purchases_dal_1.default.deletePurchase(purchaseId);
            if (!purchase) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(purchase);
        });
    }
    static createCheckoutSession(userId, userEmail, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPurchase = yield purchases_dal_1.default.addNewPurchase({
                postId: new mongoose_1.default.Types.ObjectId(post._id),
                userId: new mongoose_1.default.Types.ObjectId(userId),
                status: purchases_models_1.PaymentStatus.PENDING,
            });
            if (!newPurchase) {
                return toolkit_1.ResponseFactory.createBadRequestError();
            }
            const customer = yield stripe.customers.create({
                metadata: {
                    userId: userId.toString(),
                    purchaseId: newPurchase._id.toString(),
                    postId: post._id,
                },
                email: userEmail,
            });
            console.log(`${config_1.config.urlBackend}/images/posts/${post.picture}`);
            console.log(customer);
            const session = yield stripe.checkout.sessions.create({
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
                success_url: `${config_1.config.clientUrl}/checkout-success`,
                cancel_url: `${config_1.config.clientUrl}/main`,
            });
            if (!session || !session.url) {
                return toolkit_1.ResponseFactory.createInternalServerError();
            }
            return toolkit_1.ResponseFactory.createResponse({ url: session.url });
        });
    }
    static stripeWebhook(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("WEBHOOOOK");
            const sig = req.headers["stripe-signature"];
            let data;
            let eventType;
            if (endpointSecret) {
                let event;
                try {
                    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                    console.log("Webhook verified.");
                }
                catch (err) {
                    console.log(`Webhook Error: ${err.message}`);
                    return toolkit_1.ResponseFactory.createBadRequestError(`Webhook Error: ${err.message}`);
                }
                data = event.data.object;
                eventType = event.type;
            }
            else {
                data = req.body.data.object;
                eventType = req.body.type;
            }
            let updatedPurchase;
            if (eventType === "checkout.session.completed") {
                try {
                    console.log(data);
                    const customer = yield stripe.customers.retrieve(data.customer);
                    console.log("Metadata");
                    console.log(customer.metadata);
                    const purchaseId = customer.metadata.purchaseId;
                    const customerId = data.customer;
                    const paymentIntentId = data.payment_intent;
                    const totalPrice = data.amount_total;
                    const shipping = data.customer_details;
                    updatedPurchase = yield purchases_dal_1.default.updatePurchase(purchaseId, {
                        customerId,
                        paymentIntentId,
                        totalPrice,
                        shipping,
                        status: purchases_models_1.PaymentStatus.COMPLETED,
                    });
                    if (!updatedPurchase) {
                        return toolkit_1.ResponseFactory.createBadRequestError();
                    }
                    return toolkit_1.ResponseFactory.createResponse(updatedPurchase);
                }
                catch (error) {
                    console.log(error);
                    return toolkit_1.ResponseFactory.createInternalServerError();
                }
            }
            else if (eventType === "checkout.session.async_payment_failed" ||
                eventType === "checkout.session.expired") {
                console.log("Event failed!!");
                console.log(data);
            }
            return toolkit_1.ResponseFactory.createInternalServerError();
        });
    }
}
exports.default = PurchasesService;
