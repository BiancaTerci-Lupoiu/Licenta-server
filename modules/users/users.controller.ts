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
import {
  AddUserBody,
  IUserModel,
  IUserModelWithoutSensitiveInfo,
  UpdateUserBody,
} from "./users.models";
import UsersService from "./users.service";
import { StatusCodes } from "http-status-codes";

@Tags("Users")
@Route("users")
@ExceptionSafe(controllerExceptionHandler) // Wraps every method in a try-catch that returns a server error
export default class UsersController {
  @Get("/")
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getUsers(
    @Request() _request: ExpressRequest
  ): Promise<ControllerResponse<IUserModel[] | ControllerError>> {
    return await UsersService.getUsersList();
  }

  @Get("/{userId}")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getUserById(
    @Request() _request: ExpressRequest,
    @Path() userId: string
  ): Promise<
    ControllerResponse<IUserModelWithoutSensitiveInfo | ControllerError>
  > {
    return await UsersService.getUserById(userId);
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
  public static async addUser(
    @Request() _request: ExpressRequest,
    @Body() userDetails: AddUserBody
  ): Promise<ControllerResponse<IUserModel | ControllerError>> {
    return await UsersService.addUser(userDetails);
  }

  @Put("/{userId}")
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
  @Response<{ message: ErrorMessageCode.UNAUTHORIZED }>(
    StatusCodes.UNAUTHORIZED,
    HttpErrorMessages.UNAUTHORIZED
  )
  public static async updateUser(
    @Request() _request: ExpressRequest,
    @Path() userId: string,
    @Body() userDetails: UpdateUserBody
  ): Promise<
    ControllerResponse<IUserModelWithoutSensitiveInfo | ControllerError>
  > {
    return await UsersService.updateUser(_request, userDetails, userId);
  }

  @Get("/details")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getUserDetails(
    @Request() _request: ExpressRequest
  ): Promise<
    ControllerResponse<IUserModelWithoutSensitiveInfo | ControllerError>
  > {
    if (!_request.authenticatedUser) {
      return ResponseFactory.createUnauthorizedError(
        "The authenticated user is undefined!"
      );
    }
    const userId = _request.authenticatedUser._id;
    return await UsersService.getUserById(userId);
  }
}
