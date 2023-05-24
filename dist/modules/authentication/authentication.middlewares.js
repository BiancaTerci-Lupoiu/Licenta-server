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
exports.isAdmin = exports.isAuthenticated = void 0;
const users_dal_1 = __importDefault(require("../users/users.dal"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const toolkit_1 = require("../../toolkit");
const config_1 = require("../../config");
const users_models_1 = require("../users/users.models");
const isAuthenticated = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError("Missing token");
            return res.status(statusCode).send(body);
        }
        if (token.toLowerCase().startsWith("bearer")) {
            token = token.slice("bearer".length).trim();
        }
        jsonwebtoken_1.default.verify(token, config_1.config.secretToken, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError(err.message);
                return res.status(statusCode).send(body);
            }
            const tokenWithId = decodedToken;
            const userId = tokenWithId.userId;
            const user = yield users_dal_1.default.getUserById(userId);
            if (!user) {
                const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError();
                return res.status(statusCode).send(body);
            }
            req.authenticatedUser = user;
            next();
        }));
    }
    catch (error) {
        const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError();
        return res.status(statusCode).send(body);
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    try {
        const user = req.authenticatedUser;
        if (!user || user === undefined) {
            const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError();
            return res.status(statusCode).send(body);
        }
        if (user.role !== users_models_1.UserRoles.ADMIN) {
            const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError();
            return res.status(statusCode).send(body);
        }
        next();
    }
    catch (error) {
        const { statusCode, body } = toolkit_1.ResponseFactory.createUnauthorizedError();
        return res.status(statusCode).send(body);
    }
};
exports.isAdmin = isAdmin;
