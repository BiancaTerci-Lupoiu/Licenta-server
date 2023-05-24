import mongoose from "mongoose";
import { Condition, Genders, IPostModel } from "./posts.models";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  type: String,
  secondType: String,
  thirdType: String,
});

const CoordinatesSchema = new Schema({
  latitude: Number,
  longitude: Number,
});

const PostDataSchema = new Schema<IPostModel>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  isActive: { type: Boolean, default: true },
  title: String,
  description: String,
  gender: { type: String, enum: Genders, default: Genders.UNSPECIFIED },
  size: String,
  condition: { type: String, enum: Condition, default: Condition.SATISFYING },
  style: String,
  materials: [String],
  price: Number,
  brand: String,
  color: String,
  picture: String,
  category: CategorySchema,
  coordinates: CoordinatesSchema,
});

export const PostData = mongoose.model("Post", PostDataSchema, "posts");
