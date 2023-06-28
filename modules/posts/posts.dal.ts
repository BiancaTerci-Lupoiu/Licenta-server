// Data Access Layer for the Users
// This will contain all the database queries

import crypto from "crypto";

import { ExceptionSafe, dalExceptionHandler } from "../../toolkit";

import { ObjectId } from "mongodb";
import {
  AddPostBody,
  IPostModel,
  IPostModelWithId,
  PostFilters,
  UpdatePostBody,
} from "./posts.models";
import { PostData } from "./posts.schema";

@ExceptionSafe(dalExceptionHandler)
export default class PostsDal {
  // returns also the user details
  public static async getPostsList(): Promise<IPostModel[] | null> {
    const posts: IPostModelWithId[] =
      (await PostData.find({ isActive: true }).populate("user", {
        password: 0,
        role: 0,
        iban: 0,
        status: 0,
        confirmationToken: 0,
      })) || null;

    return posts;
  }

  public static async getPostsListFiltered(
    filters: PostFilters
  ): Promise<IPostModel[] | null> {
    const query: any = { isActive: true };
    console.log(filters);
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
    const options = { collation: { locale: "en", strength: 1 } };
    console.log(query);
    const posts: IPostModelWithId[] =
      (await PostData.find(query, {}, options).populate("user", {
        password: 0,
        role: 0,
        iban: 0,
        status: 0,
        confirmationToken: 0,
      })) || null;

    return posts;
  }

  public static async getPostsForUser(
    userId: string
  ): Promise<IPostModel[] | null> {
    const posts: IPostModelWithId[] =
      (await PostData.find({ user: userId })) || null;

    return posts;
  }

  public static async getPostById(
    postId: string
  ): Promise<IPostModelWithId | null> {
    return (
      (await PostData.findById(new ObjectId(postId)).populate("user", {
        password: 0,
        role: 0,
        iban: 0,
        status: 0,
        confirmationToken: 0,
      })) || null
    );
  }

  public static async getPostByIdWithoutPopulate(
    postId: string
  ): Promise<IPostModelWithId | null> {
    return (await PostData.findById(new ObjectId(postId))) || null;
  }

  public static async addPost(
    postDetails: IPostModel
  ): Promise<IPostModelWithId | null> {
    const newPost: IPostModelWithId = (await PostData.create(
      postDetails
    )) as unknown as IPostModelWithId;

    return newPost;
  }

  public static async updatePost(
    postId: string,
    postDetails: UpdatePostBody
  ): Promise<IPostModelWithId | null> {
    const updatedPost: IPostModelWithId | null =
      await PostData.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $set: postDetails },
        { returnOriginal: false }
      );

    return updatedPost;
  }

  public static async deletePost(postId: string): Promise<IPostModel | null> {
    return await PostData.findByIdAndDelete(new ObjectId(postId));
  }
}
