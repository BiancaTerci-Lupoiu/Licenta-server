// The Controller files will mostly be used for:
// - getting the Request, Body and Path parameters and passing them to the service
// - validating those parameters
// - Generating the Swagger Documentation

import {
  Request,
  Response,
  Tags,
  Route,
  Get,
  Post,
  Body,
  Path,
  Put,
  Delete,
  Query,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import {
  ControllerResponse,
  ControllerError,
  ExceptionSafe,
  controllerExceptionHandler,
  ErrorMessageCode,
  HttpErrorMessages,
  ResponseFactory,
} from "../../toolkit";

import { StatusCodes } from "http-status-codes";
import PostsService from "./posts.service";
import {
  AddPostBody,
  IPostModel,
  IPostModelWithId,
  PostFilters,
  UpdatePostBody,
} from "./posts.models";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

@Tags("Posts")
@Route("posts")
@ExceptionSafe(controllerExceptionHandler) // Wraps every method in a try-catch that returns a server error
export default class PostsController {
  @Get("/")
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getPosts(
    @Query() filters: PostFilters
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    return await PostsService.getPostsList(filters);
  }

  @Get("/user")
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getPostsForUser(
    @Request() _request: ExpressRequest
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    if (!_request.authenticatedUser) {
      return ResponseFactory.createUnauthorizedError(
        "The authenticated user is undefined!"
      );
    }
    return await PostsService.getPostsForUser(_request.authenticatedUser._id);
  }

  @Get("/{postId}")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getPostById(
    @Request() _request: ExpressRequest,
    @Path() postId: string
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    return await PostsService.getPostById(postId);
  }

  @Post("/")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.UNAUTHORIZED }>(
    StatusCodes.UNAUTHORIZED,
    ErrorMessageCode.UNAUTHORIZED
  )
  public static async addPost(
    @Request() _request: ExpressRequest,
    @Body() addPostBody: AddPostBody
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    if (!_request.authenticatedUser) {
      return ResponseFactory.createUnauthorizedError(
        "The authenticated user is undefined!"
      );
    }
    const postDetails = addPostBody.postDetails;
    postDetails.user = new mongoose.Types.ObjectId(
      _request.authenticatedUser._id
    );
    postDetails.picture = undefined;
    return await PostsService.addPost({
      ...addPostBody,
      postDetails,
    });
  }

  @Put("/{postId}")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async updatePost(
    @Request() _request: ExpressRequest,
    @Path() postId: string,
    @Body() postDetails: UpdatePostBody
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    return await PostsService.updatePost(postDetails, postId);
  }

  @Post("/upload/{postId}")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async uploadPostPicture(
    @Request() _request: ExpressRequest,
    @Path() postId: string,
    @Body() picture: string
  ): Promise<ControllerResponse<IPostModelWithId | ControllerError>> {
    return await PostsService.uploadPostPicture(picture, postId);
  }

  @Post("/imageFilter")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async filterByPicture(
    @Request() _request: ExpressRequest,
    @Body() picture: string
  ): Promise<ControllerResponse<IPostModel[] | ControllerError>> {
    return await PostsService.filterByPicture(picture);
  }

  @Delete("/{postId}")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  @Response<{ message: ErrorMessageCode.UNAUTHORIZED }>(
    StatusCodes.UNAUTHORIZED,
    HttpErrorMessages.UNAUTHORIZED
  )
  public static async deletePost(
    @Request() _request: ExpressRequest,
    @Path() postId: string
  ): Promise<ControllerResponse<IPostModel | ControllerError>> {
    if (!_request.authenticatedUser) {
      return ResponseFactory.createUnauthorizedError(
        "The authenticated user is undefined!"
      );
    }
    return await PostsService.deletePost(
      postId,
      _request.authenticatedUser._id
    );
  }
}
