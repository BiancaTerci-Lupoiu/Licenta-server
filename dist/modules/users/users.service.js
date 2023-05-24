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
const users_dal_1 = __importDefault(require("./users.dal"));
const toolkit_1 = require("../../toolkit");
class UsersService {
    static getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield users_dal_1.default.getUsersList();
            if (!users) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(users);
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_dal_1.default.getUserById(userId);
            if (!user) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(user);
        });
    }
    static addUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield users_dal_1.default.getUserByEmail(userDetails.email);
            if (existingUser) {
                return toolkit_1.ResponseFactory.createBadRequestError("A user with this email already exists");
            }
            const newUser = yield users_dal_1.default.addNewUser(Object.assign(Object.assign({}, userDetails), { confirmationToken: "" }));
            if (newUser) {
                return toolkit_1.ResponseFactory.createResponse(newUser);
            }
            return toolkit_1.ResponseFactory.createInternalServerError();
        });
    }
    static updateUser(request, userDetails, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.authenticatedUser ||
                request.authenticatedUser._id.toString() !== userId) {
                return toolkit_1.ResponseFactory.createUnauthorizedError();
            }
            for (const property in userDetails) {
                if (!userDetails[property]) {
                    delete userDetails[property];
                }
            }
            console.log(userDetails.picture);
            const userUpdated = yield users_dal_1.default.updateUser(userId, userDetails);
            if (!userUpdated) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(userUpdated);
        });
    }
}
exports.default = UsersService;
