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
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../../config");
mail_1.default.setApiKey(config_1.config.sendgridApiKey);
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        from: `${config_1.config.fromName} <${config_1.config.fromEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    try {
        const info = yield mail_1.default.send(message);
        console.log("Message sent: %s", info);
        return info;
    }
    catch (err) {
        return null;
    }
});
exports.default = sendEmail;
