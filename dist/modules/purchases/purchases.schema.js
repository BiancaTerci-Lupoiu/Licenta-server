"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const purchases_models_1 = require("./purchases.models");
const Schema = mongoose_1.default.Schema;
const PurchaseDataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    status: {
        type: String,
        enum: purchases_models_1.PaymentStatus,
        default: purchases_models_1.PaymentStatus.PENDING,
    },
    totalPrice: Number,
    shipping: { type: Object },
    customerId: String,
    paymentIntentId: String,
}, { timestamps: true });
exports.PurchaseData = mongoose_1.default.model("Purchase", PurchaseDataSchema, "purchases");
