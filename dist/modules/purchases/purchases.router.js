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
const authentication_middlewares_1 = require("../authentication/authentication.middlewares");
const express_2 = __importDefault(require("express"));
const purchases_controller_1 = __importDefault(require("./purchases.controller"));
const stripe = new stripe_1.default(config_1.config.stripeKey, {
    apiVersion: "2022-11-15",
});
const router = (0, express_1.Router)();
router.post("/create-checkout-session", authentication_middlewares_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("CHECKOUT");
    const { statusCode, body } = yield purchases_controller_1.default.createCheckoutSession(req, req.body);
    res.status(statusCode).send(body);
}));
router.post("/webhook", express_2.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield purchases_controller_1.default.stripeWebhook(req);
    res.status(statusCode).send(body);
}));
exports.default = router;
