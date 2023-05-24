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
const http_status_codes_1 = require("http-status-codes");
const toolkit_1 = require("../../toolkit");
const authentication_service_1 = __importDefault(require("./authentication.service"));
let AuthenticationController = class AuthenticationController {
    static loginUser(_request, userCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Try to log in user " + userCredentials.email);
            return yield authentication_service_1.default.loginUser(userCredentials);
        });
    }
    static signupUser(_request, userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield authentication_service_1.default.signupUser(userDetails);
        });
    }
    static confirmRegistration(confirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("confirm registration");
            return yield authentication_service_1.default.confirmRegistration(confirmationToken);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/login"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Bad Request"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController, "loginUser", null);
__decorate([
    (0, tsoa_1.Post)("/login"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Bad Request"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController, "signupUser", null);
__decorate([
    (0, tsoa_1.Post)("/confirm/{confirmationToken"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, "Bad Request"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticationController, "confirmRegistration", null);
AuthenticationController = __decorate([
    (0, tsoa_1.Tags)("Authentication"),
    (0, tsoa_1.Route)("auth"),
    (0, toolkit_1.ExceptionSafe)(toolkit_1.controllerExceptionHandler)
], AuthenticationController);
exports.default = AuthenticationController;
