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
const express_1 = require("express");
const authentication_middlewares_1 = require("../authentication/authentication.middlewares");
const posts_controller_1 = __importDefault(require("./posts.controller"));
const multer_1 = __importDefault(require("multer"));
const posts_validators_1 = require("./posts.validators");
const fileExtensionValidator_1 = require("../utils/fileExtensionValidator");
const storageEngine = multer_1.default.diskStorage({
    destination: "public/images/posts/",
    filename: (req, file, cb) => {
        const extension = file.mimetype.split("/").pop();
        if (req.params.postId) {
            cb(null, `${req.params.postId}.${extension}`);
        }
        else {
            cb(null, `temporary.${extension}`);
        }
    },
});
const upload = (0, multer_1.default)({ storage: storageEngine });
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    const { statusCode, body } = yield posts_controller_1.default.getPosts(filters);
    res.status(statusCode).send(body);
}));
router.get("/user", authentication_middlewares_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("posts for user");
    const { statusCode, body } = yield posts_controller_1.default.getPostsForUser(req);
    res.status(statusCode).send(body);
}));
router.post("/imageFilter", upload.single("picture"), fileExtensionValidator_1.validateFileExtension, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.files);
    console.log((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
    const { statusCode, body } = yield posts_controller_1.default.filterByPicture(req, (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename);
    res.status(statusCode).send(body);
}));
router.get("/:postId", posts_validators_1.validatePostId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { statusCode, body } = yield posts_controller_1.default.getPostById(req, postId);
    res.status(statusCode).send(body);
}));
router.delete("/:postId", authentication_middlewares_1.isAuthenticated, posts_validators_1.validatePostId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { statusCode, body } = yield posts_controller_1.default.deletePost(req, postId);
    res.status(statusCode).send(body);
}));
router.post("/", authentication_middlewares_1.isAuthenticated, posts_validators_1.validateAddPostRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("add post");
    const { statusCode, body } = yield posts_controller_1.default.addPost(req, req.body);
    res.status(statusCode).send(body);
}));
router.post("/upload/:postId", authentication_middlewares_1.isAuthenticated, posts_validators_1.validatePostId, upload.single("picture"), fileExtensionValidator_1.validateFileExtension, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log((_c = req.file) === null || _c === void 0 ? void 0 : _c.filename);
    const { postId } = req.params;
    const { statusCode, body } = yield posts_controller_1.default.uploadPostPicture(req, postId, (_d = req.file) === null || _d === void 0 ? void 0 : _d.filename);
    res.status(statusCode).send(body);
}));
router.put("/:postId", posts_validators_1.validateUpdatePostRequest, authentication_middlewares_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { statusCode, body } = yield posts_controller_1.default.updatePost(req, postId, req.body);
    res.status(statusCode).send(body);
}));
exports.default = router;
