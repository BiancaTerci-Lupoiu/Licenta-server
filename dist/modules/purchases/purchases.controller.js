"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const toolkit_1 = require("../../toolkit");
const http_status_codes_1 = require("http-status-codes");
const purchases_service_1 = __importDefault(require("./purchases.service"));
let PurchasesController = class PurchasesController {
    static getPurchases(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.getPurchasesList();
        });
    }
    static getPurchaseById(_request, purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.getPurchaseById(purchaseId);
        });
    }
    static addPurchase(_request, purchaseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.addPurchase(purchaseDetails);
        });
    }
    static updatePurchase(_request, purchaseId, purchaseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.updatePurchase(purchaseDetails, purchaseId);
        });
    }
    static deletePurchase(_request, purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.deletePurchase(purchaseId);
        });
    }
    static createCheckoutSession(_request, post) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!_request.authenticatedUser) {
                return toolkit_1.ResponseFactory.createUnauthorizedError();
            }
            return yield purchases_service_1.default.createCheckoutSession((_a = _request.authenticatedUser) === null || _a === void 0 ? void 0 : _a._id, (_b = _request.authenticatedUser) === null || _b === void 0 ? void 0 : _b.email, post);
        });
    }
    static stripeWebhook(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield purchases_service_1.default.stripeWebhook(_request);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController, "getPurchases", null);
__decorate([
    (0, tsoa_1.Get)("/{purchaseId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PurchasesController, "getPurchaseById", null);
__decorate([
    (0, tsoa_1.Post)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController, "addPurchase", null);
__decorate([
    (0, tsoa_1.Put)("/{purchaseId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController, "updatePurchase", null);
__decorate([
    (0, tsoa_1.Delete)("/{purchaseId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PurchasesController, "deletePurchase", null);
__decorate([
    (0, tsoa_1.Post)("/create-checkout-session"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController, "createCheckoutSession", null);
__decorate([
    (0, tsoa_1.Post)("/webhook"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController, "stripeWebhook", null);
PurchasesController = __decorate([
    (0, tsoa_1.Tags)("Purchases"),
    (0, tsoa_1.Route)("purchases"),
    (0, toolkit_1.ExceptionSafe)(toolkit_1.controllerExceptionHandler)
], PurchasesController);
exports.default = PurchasesController;
