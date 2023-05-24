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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config");
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.config.smtpHost,
        port: config_1.config.smtpPort,
        auth: {
            user: config_1.config.smtpEmail,
            pass: config_1.config.smtpPassword,
        },
    });
    const message = {
        from: `${config_1.config.fromName} <${config_1.config.fromEmail}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    try {
        const info = yield transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
        return info;
    }
    catch (err) {
        return null;
    }
});
