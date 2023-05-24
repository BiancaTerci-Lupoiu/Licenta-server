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
const users_controller_1 = __importDefault(require("./users.controller"));
const authentication_middlewares_1 = require("../authentication/authentication.middlewares");
const multer_1 = __importDefault(require("multer"));
const users_validators_1 = require("./users.validators");
const fileExtensionValidator_1 = require("../utils/fileExtensionValidator");
const storageEngine = multer_1.default.diskStorage({
    destination: "public/images/users/",
    filename: (req, file, cb) => {
        const extension = file.mimetype.split("/").pop();
        cb(null, `${req.params.userId}.${extension}`);
    },
});
const upload = (0, multer_1.default)({ storage: storageEngine });
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield users_controller_1.default.getUsers(req);
    res.status(statusCode).send(body);
}));
router.get("/details", authentication_middlewares_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield users_controller_1.default.getUserDetails(req);
    res.status(statusCode).send(body);
}));
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { statusCode, body } = yield users_controller_1.default.getUserById(req, userId);
    res.status(statusCode).send(body);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode, body } = yield users_controller_1.default.addUser(req, req.body);
    res.status(statusCode).send(body);
}));
router.put("/:userId", authentication_middlewares_1.isAuthenticated, users_validators_1.validateUpdateUserRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { statusCode, body } = yield users_controller_1.default.updateUser(req, userId, req.body);
    res.status(statusCode).send(body);
}));
router.post("/upload/:userId", authentication_middlewares_1.isAuthenticated, users_validators_1.validateUserId, upload.single("picture"), fileExtensionValidator_1.validateFileExtension, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
    const { userId } = req.params;
    const { statusCode, body } = yield users_controller_1.default.updateUser(req, userId, {
        picture: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename,
    });
    res.status(statusCode).send(body);
}));
exports.default = router;
