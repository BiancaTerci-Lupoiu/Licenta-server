"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const posts_models_1 = require("./posts.models");
const Schema = mongoose_1.default.Schema;
const CategorySchema = new Schema({
    type: String,
    secondType: String,
    thirdType: String,
});
const CoordinatesSchema = new Schema({
    latitude: Number,
    longitude: Number,
});
const PostDataSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    title: String,
    description: String,
    gender: { type: String, enum: posts_models_1.Genders, default: posts_models_1.Genders.UNSPECIFIED },
    size: String,
    condition: { type: String, enum: posts_models_1.Condition, default: posts_models_1.Condition.SATISFYING },
    style: String,
    materials: [String],
    price: Number,
    brand: String,
    color: String,
    picture: String,
    category: CategorySchema,
    coordinates: CoordinatesSchema,
});
exports.PostData = mongoose_1.default.model("Post", PostDataSchema, "posts");
