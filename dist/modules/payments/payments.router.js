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
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../config");
const toolkit_1 = require("../../toolkit");
const authentication_middlewares_1 = require("../authentication/authentication.middlewares");
const express_2 = __importDefault(require("express"));
const stripe = new stripe_1.default(config_1.config.stripeKey, {
    apiVersion: "2022-11-15",
});
const router = (0, express_1.Router)();
router.post("/create-checkout-session", authentication_middlewares_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.body.post;
    console.log(`${config_1.config.urlBackend}/images/posts/${post.picture}`);
    const session = yield stripe.checkout.sessions.create({
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
    console.log(session.url);
    res.status(toolkit_1.StatusCode.OK).send({ url: session.url });
}));
const endpointSecret = "whsec_975c17322a7d86a8e6aa4e6d0215132e603a565dbaabbd09eb6f1589d996bf39";
router.post("/webhook", express_2.default.raw({ type: "application/json" }), (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log("Webhook verified.");
    }
    catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntentSucceeded = event.data.object;
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    response.send().end();
});
exports.default = router;
