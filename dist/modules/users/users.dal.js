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
const users_models_1 = require("./users.models");
const toolkit_1 = require("../../toolkit");
const users_schema_1 = require("./users.schema");
const mongodb_1 = require("mongodb");
let UsersDal = class UsersDal {
    static getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield users_schema_1.UserData.find()) || null;
            return users;
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield users_schema_1.UserData.findById(new mongodb_1.ObjectId(userId), { password: 0 })) || null);
        });
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_schema_1.UserData.findOne({ email });
        });
    }
    static addNewUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = (yield users_schema_1.UserData.create(userDetails));
            return newUser;
        });
    }
    static updateUser(userId, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield users_schema_1.UserData.findOneAndUpdate({ _id: new mongodb_1.ObjectId(userId) }, { $set: userDetails }, { returnOriginal: false, projection: { password: 0 } });
            return updatedUser;
        });
    }
    static activateAccount(confirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_schema_1.UserData.findOneAndUpdate({ confirmationToken }, { $set: { status: users_models_1.AccountStatus.ACTIVE } });
            return user;
        });
    }
};
UsersDal = __decorate([
    (0, toolkit_1.ExceptionSafe)(toolkit_1.dalExceptionHandler)
], UsersDal);
exports.default = UsersDal;
