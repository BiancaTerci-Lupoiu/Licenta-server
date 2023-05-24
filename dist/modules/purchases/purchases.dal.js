"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("../../toolkit");
const mongodb_1 = require("mongodb");
const purchases_schema_1 = require("./purchases.schema");
let PurchasesDal = class PurchasesDal {
    static getPurchasesList() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield purchases_schema_1.PurchaseData.find()) || null;
            return users;
        });
    }
    static getPurchaseById(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield purchases_schema_1.PurchaseData.findById(new mongodb_1.ObjectId(purchaseId))) || null;
        });
    }
    static addNewPurchase(purchaseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPurchase = (yield purchases_schema_1.PurchaseData.create(purchaseDetails));
            return newPurchase;
        });
    }
    static updatePurchase(purchaseId, purchaseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPurchase = yield purchases_schema_1.PurchaseData.findOneAndUpdate({ _id: new mongodb_1.ObjectId(purchaseId) }, { $set: purchaseDetails }, { returnOriginal: false });
            return updatedPurchase;
        });
    }
    static deletePurchase(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_schema_1.PurchaseData.findByIdAndDelete(new mongodb_1.ObjectId(purchaseId));
        });
    }
};
PurchasesDal = __decorate([
    (0, toolkit_1.ExceptionSafe)(toolkit_1.dalExceptionHandler)
], PurchasesDal);
exports.default = PurchasesDal;
