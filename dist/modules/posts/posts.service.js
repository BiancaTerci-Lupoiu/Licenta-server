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
const toolkit_1 = require("../../toolkit");
const users_dal_1 = __importDefault(require("../users/users.dal"));
const filtersServerApis_1 = require("../utils/filtersServerApis");
const posts_dal_1 = __importDefault(require("./posts.dal"));
const fs_1 = __importDefault(require("fs"));
const DIR = "public/images/posts/";
class PostsService {
    static getPostsList(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts;
            if (!filters || Object.keys(filters).length === 0) {
                posts = yield posts_dal_1.default.getPostsList();
            }
            else {
                posts = yield posts_dal_1.default.getPostsListFiltered(filters);
            }
            if (!posts) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(posts);
        });
    }
    static getPostsListByKeywords(words) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts = yield posts_dal_1.default.getPostsList();
            if (!posts) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            if (!words) {
                return toolkit_1.ResponseFactory.createResponse(posts);
            }
            words = words
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ");
            const wordsList = words.split(" ");
            posts = posts.filter((post) => {
                const postProperties = JSON.stringify(post)
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                for (const word of wordsList) {
                    const matched = postProperties.includes(word);
                    if (!matched) {
                        return false;
                    }
                }
                return true;
            });
            return toolkit_1.ResponseFactory.createResponse(posts);
        });
    }
    static getPostsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield posts_dal_1.default.getPostsForUser(userId);
            if (!posts) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            console.log(posts.length);
            return toolkit_1.ResponseFactory.createResponse(posts);
        });
    }
    static filterByPicture(picture) {
        return __awaiter(this, void 0, void 0, function* () {
            const filterResponse = yield (0, filtersServerApis_1.filterImagesByPicture)(picture);
            console.log(filterResponse);
            const picturesPaths = filterResponse.pictures;
            const percentages = filterResponse.percentages;
            if (!picturesPaths) {
                return toolkit_1.ResponseFactory.createInternalServerError();
            }
            let posts = yield posts_dal_1.default.getPostsListFiltered({
                picture: picturesPaths,
            });
            if (!posts) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            posts = posts.sort((post1, post2) => {
                const indexA = picturesPaths.indexOf(post1.picture);
                const indexB = picturesPaths.indexOf(post2.picture);
                return indexA - indexB;
            });
            console.log("Postari");
            console.log(posts);
            let postsWithPercentages = [];
            for (let i = 0; i < posts.length; i++) {
                let oldPost = Object.assign({}, posts[i]);
                oldPost = oldPost._doc;
                oldPost.percentage = percentages[i];
                postsWithPercentages.push(oldPost);
            }
            console.log(postsWithPercentages);
            return toolkit_1.ResponseFactory.createResponse(postsWithPercentages);
        });
    }
    static getPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_dal_1.default.getPostById(postId);
            if (!post) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(post);
        });
    }
    static addPost(addPostBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const postDetails = addPostBody.postDetails;
            const user = yield users_dal_1.default.getUserById(postDetails.user.toString());
            if (!user) {
                return toolkit_1.ResponseFactory.createNotFoundError("User not found");
            }
            console.log("updating user " + postDetails.user.toString());
            console.log(addPostBody.address);
            let updateUserBody = { address: addPostBody.address };
            if (addPostBody.iban) {
                updateUserBody = Object.assign(Object.assign({}, updateUserBody), { iban: addPostBody.iban });
            }
            const updatedUser = yield users_dal_1.default.updateUser(postDetails.user.toString(), updateUserBody);
            if (!updatedUser) {
                return toolkit_1.ResponseFactory.createNotFoundError("User not found");
            }
            const newPost = yield posts_dal_1.default.addPost(postDetails);
            if (newPost) {
                return toolkit_1.ResponseFactory.createResponse(newPost);
            }
            return toolkit_1.ResponseFactory.createInternalServerError();
        });
    }
    static updatePost(postDetails, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const property in postDetails) {
                if (!postDetails[property]) {
                    delete postDetails[property];
                }
            }
            const postUpdated = yield posts_dal_1.default.updatePost(postId, postDetails);
            if (!postUpdated) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(postUpdated);
        });
    }
    static uploadPostPicture(picture, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedFeatures = yield (0, filtersServerApis_1.savePictureFeatures)(picture);
            if (!savedFeatures) {
                yield posts_dal_1.default.deletePost(postId);
                try {
                    fs_1.default.unlinkSync(`${DIR}/${picture}`);
                    console.log(`successfully deleted ${picture}`);
                }
                catch (err) {
                    return toolkit_1.ResponseFactory.createInternalServerError();
                }
                return toolkit_1.ResponseFactory.createInternalServerError();
            }
            console.log("saved features!");
            const postUpdated = yield posts_dal_1.default.updatePost(postId, { picture });
            if (!postUpdated) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            return toolkit_1.ResponseFactory.createResponse(postUpdated);
        });
    }
    static deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postToBeDeleted = yield posts_dal_1.default.getPostByIdWithoutPopulate(postId);
            if (!postToBeDeleted) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            console.log(userId);
            console.log(postToBeDeleted.user);
            if (postToBeDeleted.user.toString() !== userId.toString()) {
                return toolkit_1.ResponseFactory.createUnauthorizedError();
            }
            const post = yield posts_dal_1.default.deletePost(postId);
            if (!post) {
                return toolkit_1.ResponseFactory.createNotFoundError();
            }
            try {
                fs_1.default.unlinkSync(`${DIR}/${post.picture}`);
                console.log(`successfully deleted ${post.picture}`);
            }
            catch (err) {
                return toolkit_1.ResponseFactory.createInternalServerError();
            }
            return toolkit_1.ResponseFactory.createResponse(post);
        });
    }
}
exports.default = PostsService;
