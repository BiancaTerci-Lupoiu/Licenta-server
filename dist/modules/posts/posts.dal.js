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
const toolkit_1 = require("../../toolkit");
const mongodb_1 = require("mongodb");
const posts_schema_1 = require("./posts.schema");
let PostsDal = class PostsDal {
    static getPostsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = (yield posts_schema_1.PostData.find({ isActive: true }).populate("user", {
                password: 0,
                role: 0,
                iban: 0,
                status: 0,
                confirmationToken: 0,
            })) || null;
            return posts;
        });
    }
    static getPostsListFiltered(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { isActive: true };
            if (filters.type) {
                query["category.type"] = { $in: filters.type };
            }
            if (filters.secondType) {
                query["category.secondType"] = { $in: filters.secondType };
            }
            if (filters.size) {
                query.size = { $in: filters.size };
            }
            if (filters.color) {
                query.color = { $in: filters.color };
            }
            if (filters.brand) {
                query.brand = { $in: filters.brand };
            }
            if (filters.materials) {
                query.materials = { $in: filters.materials };
            }
            if (filters.gender) {
                query.gender = { $in: filters.gender };
            }
            if (filters.style) {
                query.style = { $in: filters.style };
            }
            if (filters.picture) {
                query.picture = { $in: filters.picture };
            }
            if (filters.minPrice && filters.maxPrice) {
                query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
            }
            const posts = (yield posts_schema_1.PostData.find(query).populate("user", {
                password: 0,
                role: 0,
                iban: 0,
                status: 0,
                confirmationToken: 0,
            })) || null;
            return posts;
        });
    }
    static getPostsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = (yield posts_schema_1.PostData.find({ user: userId })) || null;
            return posts;
        });
    }
    static getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield posts_schema_1.PostData.findById(new mongodb_1.ObjectId(postId)).populate("user", {
                password: 0,
                role: 0,
                iban: 0,
                status: 0,
                confirmationToken: 0,
            })) || null);
        });
    }
    static getPostByIdWithoutPopulate(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield posts_schema_1.PostData.findById(new mongodb_1.ObjectId(postId))) || null;
        });
    }
    static addPost(postDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = (yield posts_schema_1.PostData.create(postDetails));
            return newPost;
        });
    }
    static updatePost(postId, postDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPost = yield posts_schema_1.PostData.findOneAndUpdate({ _id: new mongodb_1.ObjectId(postId) }, { $set: postDetails }, { returnOriginal: false });
            return updatedPost;
        });
    }
    static deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_schema_1.PostData.findByIdAndDelete(new mongodb_1.ObjectId(postId));
        });
    }
};
PostsDal = __decorate([
    (0, toolkit_1.ExceptionSafe)(toolkit_1.dalExceptionHandler)
], PostsDal);
exports.default = PostsDal;
