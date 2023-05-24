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
exports.UserData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const users_models_1 = require("./users.models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Schema = mongoose_1.default.Schema;
const UserDataSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    role: { type: String, enum: users_models_1.UserRoles, default: users_models_1.UserRoles.USER },
    address: {
        coordinates: {
            latitude: Number,
            longitude: Number,
        },
        locality: String,
        city: String,
        street: String,
        number: Number,
        zipCode: Number,
    },
    iban: String,
    picture: String,
    status: { type: String, enum: users_models_1.AccountStatus, default: users_models_1.AccountStatus.PENDING },
    confirmationToken: { type: String, default: "" },
});
UserDataSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    });
});
exports.UserData = mongoose_1.default.model("User", UserDataSchema, "users");
