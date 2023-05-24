"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const tsoa_1 = require("tsoa");
const toolkit_1 = require("../../toolkit");
const users_service_1 = __importDefault(require("./users.service"));
const http_status_codes_1 = require("http-status-codes");
let UsersController = class UsersController {
    static getUsers(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_service_1.default.getUsersList();
        });
    }
    static getUserById(_request, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_service_1.default.getUserById(userId);
        });
    }
    static addUser(_request, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_service_1.default.addUser(userDetails);
        });
    }
    static updateUser(_request, userId, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_service_1.default.updateUser(_request, userDetails, userId);
        });
    }
    static getUserDetails(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_request.authenticatedUser) {
                return toolkit_1.ResponseFactory.createUnauthorizedError("The authenticated user is undefined!");
            }
            const userId = _request.authenticatedUser._id;
            return yield users_service_1.default.getUserById(userId);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController, "getUsers", null);
__decorate([
    (0, tsoa_1.Get)("/{userId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController, "getUserById", null);
__decorate([
    (0, tsoa_1.Post)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController, "addUser", null);
__decorate([
    (0, tsoa_1.Put)("/{userId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.UNAUTHORIZED, toolkit_1.HttpErrorMessages.UNAUTHORIZED),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController, "updateUser", null);
__decorate([
    (0, tsoa_1.Get)("/details"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController, "getUserDetails", null);
UsersController = __decorate([
    (0, tsoa_1.Tags)("Users"),
    (0, tsoa_1.Route)("users"),
    (0, toolkit_1.ExceptionSafe)(toolkit_1.controllerExceptionHandler)
], UsersController);
exports.default = UsersController;
