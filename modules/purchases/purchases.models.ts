import mongoose from "mongoose";

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IPurchaseModel {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  status: PaymentStatus;
  totalPrice?: number;
  shipping?: object;
  customerId?: string;
  paymentIntentId?: string;
}

export interface UpdatePurchaseBody {
  status?: PaymentStatus;
  totalPrice?: number;
  shipping?: object;
  customerId?: string;
  paymentIntentId?: string;
}

export interface IPurchaseModelWithId extends IPurchaseModel {
  _id: string;
}

export interface CheckoutSessionResponse {
  url: string;
}
