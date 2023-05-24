import { ExceptionSafe, dalExceptionHandler } from "../../toolkit";

import { ObjectId } from "mongodb";
import {
  IPurchaseModel,
  IPurchaseModelWithId,
  UpdatePurchaseBody,
} from "./purchases.models";
import { PurchaseData } from "./purchases.schema";

@ExceptionSafe(dalExceptionHandler)
export default class PurchasesDal {
  public static async getPurchasesList(): Promise<IPurchaseModel[] | null> {
    const users = (await PurchaseData.find()) || null;

    return users;
  }

  public static async getPurchaseById(
    purchaseId: string
  ): Promise<IPurchaseModelWithId | null> {
    return (await PurchaseData.findById(new ObjectId(purchaseId))) || null;
  }

  public static async addNewPurchase(
    purchaseDetails: IPurchaseModel
  ): Promise<IPurchaseModelWithId | null> {
    const newPurchase: IPurchaseModelWithId = (await PurchaseData.create(
      purchaseDetails
    )) as unknown as IPurchaseModelWithId;

    return newPurchase;
  }

  public static async updatePurchase(
    purchaseId: string,
    purchaseDetails: UpdatePurchaseBody
  ): Promise<IPurchaseModelWithId | null> {
    const updatedPurchase: IPurchaseModelWithId | null =
      await PurchaseData.findOneAndUpdate(
        { _id: new ObjectId(purchaseId) },
        { $set: purchaseDetails },
        { returnOriginal: false }
      );

    return updatedPurchase;
  }

  public static async deletePurchase(
    purchaseId: string
  ): Promise<IPurchaseModel | null> {
    return await PurchaseData.findByIdAndDelete(new ObjectId(purchaseId));
  }
}
