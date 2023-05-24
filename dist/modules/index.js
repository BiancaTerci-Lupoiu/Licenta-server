"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const users_router_1 = __importDefault(require("./users/users.router"));
const authentication_router_1 = __importDefault(require("./authentication/authentication.router"));
const posts_router_1 = __importDefault(require("./posts/posts.router"));
const purchases_router_1 = __importDefault(require("./purchases/purchases.router"));
app.use("/users/", users_router_1.default);
app.use("/auth/", authentication_router_1.default);
app.use("/posts/", posts_router_1.default);
app.use("/purchases/", purchases_router_1.default);
exports.default = app;
