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
const http_status_codes_1 = require("http-status-codes");
const posts_service_1 = __importDefault(require("./posts.service"));
const mongoose_1 = __importDefault(require("mongoose"));
let PostsController = class PostsController {
    static getPosts(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.getPostsList(filters);
        });
    }
    static getPostsByKeywords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.getPostsListByKeywords(words);
        });
    }
    static getPostsForUser(_request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_request.authenticatedUser) {
                return toolkit_1.ResponseFactory.createUnauthorizedError("The authenticated user is undefined!");
            }
            return yield posts_service_1.default.getPostsForUser(_request.authenticatedUser._id);
        });
    }
    static getPostById(_request, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.getPostById(postId);
        });
    }
    static addPost(_request, addPostBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_request.authenticatedUser) {
                return toolkit_1.ResponseFactory.createUnauthorizedError("The authenticated user is undefined!");
            }
            const postDetails = addPostBody.postDetails;
            postDetails.user = new mongoose_1.default.Types.ObjectId(_request.authenticatedUser._id);
            postDetails.picture = undefined;
            return yield posts_service_1.default.addPost(Object.assign(Object.assign({}, addPostBody), { postDetails }));
        });
    }
    static updatePost(_request, postId, postDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.updatePost(postDetails, postId);
        });
    }
    static uploadPostPicture(_request, postId, picture) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.uploadPostPicture(picture, postId);
        });
    }
    static filterByPicture(_request, picture) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_service_1.default.filterByPicture(picture);
        });
    }
    static deletePost(_request, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_request.authenticatedUser) {
                return toolkit_1.ResponseFactory.createUnauthorizedError("The authenticated user is undefined!");
            }
            return yield posts_service_1.default.deletePost(postId, _request.authenticatedUser._id);
        });
    }
};
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController, "getPosts", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController, "getPostsByKeywords", null);
__decorate([
    (0, tsoa_1.Get)("/user"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController, "getPostsForUser", null);
__decorate([
    (0, tsoa_1.Get)("/{postId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController, "getPostById", null);
__decorate([
    (0, tsoa_1.Post)("/"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.UNAUTHORIZED, toolkit_1.ErrorMessageCode.UNAUTHORIZED),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController, "addPost", null);
__decorate([
    (0, tsoa_1.Put)("/{postId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PostsController, "updatePost", null);
__decorate([
    (0, tsoa_1.Post)("/upload/{postId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PostsController, "uploadPostPicture", null);
__decorate([
    (0, tsoa_1.Post)("/imageFilter"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.BAD_REQUEST, toolkit_1.HttpErrorMessages.BAD_REQUEST),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, toolkit_1.HttpErrorMessages.INTERNAL_SERVER_ERROR),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController, "filterByPicture", null);
__decorate([
    (0, tsoa_1.Delete)("/{postId}"),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.NOT_FOUND, toolkit_1.HttpErrorMessages.NOT_FOUND),
    (0, tsoa_1.Response)(http_status_codes_1.StatusCodes.UNAUTHORIZED, toolkit_1.HttpErrorMessages.UNAUTHORIZED),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController, "deletePost", null);
PostsController = __decorate([
    (0, tsoa_1.Tags)("Posts"),
    (0, tsoa_1.Route)("posts"),
    (0, toolkit_1.ExceptionSafe)(toolkit_1.controllerExceptionHandler)
], PostsController);
exports.default = PostsController;
