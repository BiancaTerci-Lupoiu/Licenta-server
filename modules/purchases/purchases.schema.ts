import mongoose from "mongoose";
import { IPurchaseModel, PaymentStatus } from "./purchases.models";

const Schema = mongoose.Schema;

const PurchaseDataSchema = new Schema<IPurchaseModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },
    totalPrice: Number,
    shipping: { type: Object },
    customerId: String,
    paymentIntentId: String,
  },
  { timestamps: true }
);

export const PurchaseData = mongoose.model(
  "Purchase",
  PurchaseDataSchema,
  "purchases"
);
