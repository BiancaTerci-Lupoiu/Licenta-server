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
const authentication_controller_1 = __importDefault(require("./authentication.controller"));
const authentication_validators_1 = require("./authentication.validators");
const router = (0, express_1.Router)();
router.post("/login", authentication_validators_1.validateLoginRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield authentication_controller_1.default.loginUser(req, req.body);
    res.status(statusCode).send(body);
}));
router.post("/signup", authentication_validators_1.validateRegisterUserRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield authentication_controller_1.default.signupUser(req, req.body);
    res.status(statusCode).send(body);
}));
router.get("/confirm/:confirmationToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { confirmationToken } = req.params;
    const { statusCode, body } = yield authentication_controller_1.default.confirmRegistration(confirmationToken);
    res.status(statusCode).send(body);
}));
exports.default = router;
