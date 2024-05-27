// This file will contain all the logic of the routes

import {
  ControllerError,
  ControllerResponse,
  ResponseFactory,
} from '../../toolkit';
import UsersDal from '../users/users.dal';
import { UpdateUserBody } from '../users/users.models';
import {
  filterImagesByPicture,
  savePictureFeatures,
} from '../utils/filtersServerApis';
import PostsDal from './posts.dal';
import {
  AddPostBody,
  IPostModel,
  IPostModelWithId,
  IPostModelWithPercentage,
  PostFilters,
  UpdatePostBody,
} from './posts.models';
import fs from 'fs';

const DIR = 'public/images/posts/';

export default class PostsService {
  public static async getPostsList(
    filters: PostFilters
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    let posts;
    if (!filters || Object.keys(filters).length === 0) {
      posts = await PostsDal.getPostsList();
    } else {
      posts = await PostsDal.getPostsListFiltered(filters);
    }
    if (!posts) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(posts);
  }

  public static async getPostsListByKeywords(
    words: string
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    let posts = await PostsDal.getPostsList();

    if (!posts) {
      return ResponseFactory.createNotFoundError();
    }

    if (!words) {
      return ResponseFactory.createResponse(posts);
    }

    words = words
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
    const wordsList = words.split(' ');
    // Filter the posts based on the words list
    posts = posts.filter((post) => {
      const postProperties = JSON.stringify(post)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      for (const word of wordsList) {
        const matched = postProperties.includes(word);
        if (!matched) {
          return false;
        }
      }
      return true;
    });
    return ResponseFactory.createResponse(posts);
  }

  public static async getPostsForUser(
    userId: string
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    const posts = await PostsDal.getPostsForUser(userId);
    if (!posts) {
      return ResponseFactory.createNotFoundError();
    }
    console.log(posts.length);
    return ResponseFactory.createResponse(posts);
  }

  public static async filterByPicture(
    picture: string
  ): Promise<ControllerResponse<IPostModelWithPercentage[] | ControllerError>> {
    const filterResponse = await filterImagesByPicture(picture);
    console.log(filterResponse);
    const picturesPaths = filterResponse.pictures;
    const percentages = filterResponse.percentages;

    if (!picturesPaths) {
      return ResponseFactory.createInternalServerError();
    }

    let posts = await PostsDal.getPostsListFiltered({
      picture: picturesPaths,
    });

    if (!posts) {
      return ResponseFactory.createNotFoundError();
    }
    posts = posts.sort((post1, post2) => {
      const indexA = picturesPaths.indexOf(post1.picture!);
      const indexB = picturesPaths.indexOf(post2.picture!);
      return indexA - indexB;
    });

    console.log('Postari');
    console.log(posts);
    let postsWithPercentages: IPostModelWithPercentage[] = [];
    for (let i = 0; i < posts.length; i++) {
      let oldPost: any = { ...posts[i] };
      oldPost = oldPost._doc;
      oldPost.percentage = percentages[i];
      postsWithPercentages.push(oldPost);
    }

    console.log(postsWithPercentages);

    return ResponseFactory.createResponse(postsWithPercentages);
  }

  public static async getPostById(
    postId: string
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    const post = await PostsDal.getPostById(postId);
    if (!post) {
      return ResponseFactory.createNotFoundError();
    }

    return ResponseFactory.createResponse(post);
  }

  public static async addPost(
    addPostBody: AddPostBody
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    const postDetails = addPostBody.postDetails;
    const user = await UsersDal.getUserById(postDetails.user.toString());

    if (!user) {
      return ResponseFactory.createNotFoundError('User not found');
    }
    console.log('updating user ' + postDetails.user.toString());
    console.log(addPostBody.address);
    let updateUserBody: UpdateUserBody = { address: addPostBody.address };
    if (addPostBody.iban) {
      updateUserBody = { ...updateUserBody, iban: addPostBody.iban };
    }
    const updatedUser = await UsersDal.updateUser(
      postDetails.user.toString(),
      updateUserBody
    );

    if (!updatedUser) {
      return ResponseFactory.createNotFoundError('User not found');
    }

    const newPost = await PostsDal.addPost(postDetails);

    if (newPost) {
      return ResponseFactory.createResponse(newPost);
    }

    return ResponseFactory.createInternalServerError();
  }

  public static async updatePost(
    postDetails: UpdatePostBody,
    postId: string
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    for (const property in postDetails) {
      if (!postDetails[property as keyof UpdatePostBody]) {
        delete postDetails[property as keyof UpdatePostBody];
      }
    }
    const postUpdated = await PostsDal.updatePost(postId, postDetails);
    if (!postUpdated) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(postUpdated);
  }

  public static async uploadPostPicture(
    picture: string,
    postId: string
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    // save picture features
    const savedFeatures = await savePictureFeatures(picture);

    if (!savedFeatures) {
      await PostsDal.deletePost(postId);
      // delete post image
      try {
        fs.unlinkSync(`${DIR}/${picture}`);
        console.log(`successfully deleted ${picture}`);
      } catch (err) {
        return ResponseFactory.createInternalServerError();
      }

      return ResponseFactory.createInternalServerError();
    }
    console.log('saved features!');
    const postUpdated = await PostsDal.updatePost(postId, { picture });
    if (!postUpdated) {
      return ResponseFactory.createNotFoundError();
    }
    return ResponseFactory.createResponse(postUpdated);
  }

  public static async deletePost(
    postId: string,
    userId: string
  ): Promise<ControllerResponse<IPostModel | ControllerError>> {
    const postToBeDeleted = await PostsDal.getPostByIdWithoutPopulate(postId);
    if (!postToBeDeleted) {
      return ResponseFactory.createNotFoundError();
    }
    console.log(userId);
    console.log(postToBeDeleted.user);
    if (postToBeDeleted.user.toString() !== userId.toString()) {
      return ResponseFactory.createUnauthorizedError();
    }

    const post = await PostsDal.deletePost(postId);

    if (!post) {
      return ResponseFactory.createNotFoundError();
    }

    // delete post image
    try {
      fs.unlinkSync(`${DIR}/${post.picture}`);
      console.log(`successfully deleted ${post.picture}`);
    } catch (err) {
      return ResponseFactory.createInternalServerError();
    }

    return ResponseFactory.createResponse(post);
  }
}
