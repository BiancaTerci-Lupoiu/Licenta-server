"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const users_dal_1 = __importDefault(require("../users/users.dal"));
const users_models_1 = require("../users/users.models");
const toolkit_1 = require("../../toolkit");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const sendEmail_1 = __importStar(require("../utils/sendEmail"));
class AuthenticationService {
    static loginUser(userCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_dal_1.default.getUserByEmail(userCredentials.email);
            if (!user) {
                return toolkit_1.ResponseFactory.createNotFoundError("User not found!");
            }
            if (user.status === users_models_1.AccountStatus.PENDING) {
                return toolkit_1.ResponseFactory.createBadRequestError("Pending Account. Please Verify Your Email!");
            }
            const validPassword = yield bcrypt_1.default.compare(userCredentials.password, user.password);
            if (!validPassword) {
                return toolkit_1.ResponseFactory.createBadRequestError("Invalid email/password!");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.config.secretToken, {
                expiresIn: config_1.config.jwtExpire,
            });
            const responseBody = {
                token: token,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    iban: user.iban,
                    picture: user.picture,
                    address: user.address,
                    role: user.role,
                },
            };
            return toolkit_1.ResponseFactory.createResponse(responseBody);
        });
    }
    static signupUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield users_dal_1.default.getUserByEmail(userDetails.email);
            if (existingUser) {
                return toolkit_1.ResponseFactory.createBadRequestError("A user with this email already exists");
            }
            const confirmationToken = jsonwebtoken_1.default.sign({ email: userDetails.email }, config_1.config.secretToken);
            const user = yield users_dal_1.default.addNewUser(Object.assign(Object.assign({}, userDetails), { confirmationToken }));
            if (!user) {
                return toolkit_1.ResponseFactory.createBadRequestError("Could not register user!");
            }
            const message = `Click the link to confirm your email <a href=http://localhost:${config_1.config.port}/api/auth/confirm/${confirmationToken}> Click here! </a>`;
            const emailSent = yield (0, sendEmail_1.default)({
                message,
                subject: "Account confirmation",
                email: user.email,
            });
            if (!emailSent) {
                return toolkit_1.ResponseFactory.createInternalServerError("Email could not be sent!");
            }
            return toolkit_1.ResponseFactory.createResponse({
                message: "Check your email to activate your account!",
            });
        });
    }
    static confirmRegistration(confirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_dal_1.default.activateAccount(confirmationToken);
            if (!user) {
                return toolkit_1.ResponseFactory.createBadRequestError("Invalid token!");
            }
            return toolkit_1.ResponseFactory.createResponse(sendEmail_1.emailVerifiedPageContent);
        });
    }
}
exports.default = AuthenticationService;
