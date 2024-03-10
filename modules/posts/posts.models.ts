import mongoose from "mongoose";
import { Address } from "../users/users.models";

export enum Genders {
  FEMALE = "FEMININ",
  MALE = "MASCULIN",
  UNSPECIFIED = "NESPECIFICAT",
}

export enum Condition {
  GOOD = "STARE BUNĂ",
  EXCELLENT = "STARE EXCELENTĂ",
  SATISFYING = "STARE SATISFACATOARE",
  UNWORN = "NEPURTAT",
  NEW = "NOUĂ",
}

export interface Category {
  type: string;
  secondType: string;
  thirdType: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface IPostModel {
  user: mongoose.Types.ObjectId;
  isActive: boolean;
  title: string;
  description: string;
  gender: Genders;
  size: string;
  condition: Condition;
  style: string;
  materials: string[];
  price: number;
  brand: string;
  color: string;
  picture?: string;
  category: Category;
  coordinates: Coordinates;
}

export interface IPostModelWithPercentage {
  percentage: number;
}

export interface AddPostBody {
  postDetails: IPostModel;
  address: Address;
  iban?: string;
}

export interface IPostModelWithId extends IPostModel {
  _id: string;
}

export interface UpdatePostBody {
  title?: string;
  description?: string;
  gender?: Genders;
  size?: string;
  condition?: Condition;
  style?: string;
  materials?: string[];
  price?: number;
  brand?: string;
  color?: string;
  category?: Category;
  picture?: string;
  isActive?: boolean;
}

export interface PostFilters {
  type?: string[];
  gender?: string[];
  style?: string[];
  materials?: string[];
  brand?: string[];
  color?: string[];
  size?: string[];
  secondType?: string[];
  minPrice?: number;
  maxPrice?: number;
  picture?: string[];
}

export interface KeywordsFilter {
  words: string;
}

export interface PictureFeatures {
  features: number[];
  pictureName: string;
}
