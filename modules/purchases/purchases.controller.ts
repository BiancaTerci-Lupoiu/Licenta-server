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
import {
  CheckoutSessionResponse,
  IPurchaseModel,
  IPurchaseModelWithId,
  UpdatePurchaseBody,
} from "./purchases.models";
import PurchasesService from "./purchases.service";
import { IPostModelWithId } from "../posts/posts.models";

@Tags("Purchases")
@Route("purchases")
@ExceptionSafe(controllerExceptionHandler) // Wraps every method in a try-catch that returns a server error
export default class PurchasesController {
  @Get("/")
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getPurchases(
    @Request() _request: ExpressRequest
  ): Promise<ControllerResponse<IPurchaseModel[] | ControllerError>> {
    return await PurchasesService.getPurchasesList();
  }

  @Get("/{purchaseId}")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async getPurchaseById(
    @Request() _request: ExpressRequest,
    @Path() purchaseId: string
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    return await PurchasesService.getPurchaseById(purchaseId);
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
  public static async addPurchase(
    @Request() _request: ExpressRequest,
    @Body() purchaseDetails: IPurchaseModel
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    return await PurchasesService.addPurchase(purchaseDetails);
  }

  @Put("/{purchaseId}")
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
  public static async updatePurchase(
    @Request() _request: ExpressRequest,
    @Path() purchaseId: string,
    // to be completed
    @Body() purchaseDetails: UpdatePurchaseBody
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    return await PurchasesService.updatePurchase(purchaseDetails, purchaseId);
  }

  @Delete("/{purchaseId}")
  @Response<{ message: ErrorMessageCode.NOT_FOUND }>(
    StatusCodes.NOT_FOUND,
    HttpErrorMessages.NOT_FOUND
  )
  public static async deletePurchase(
    @Request() _request: ExpressRequest,
    @Path() purchaseId: string
  ): Promise<ControllerResponse<IPurchaseModel | ControllerError>> {
    return await PurchasesService.deletePurchase(purchaseId);
  }

  @Post("/create-checkout-session")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async createCheckoutSession(
    @Request() _request: ExpressRequest,
    @Body() post: IPostModelWithId
  ): Promise<ControllerResponse<CheckoutSessionResponse | ControllerError>> {
    if (!_request.authenticatedUser) {
      return ResponseFactory.createUnauthorizedError();
    }
    return await PurchasesService.createCheckoutSession(
      _request.authenticatedUser?._id,
      _request.authenticatedUser?.email,
      post
    );
  }

  @Post("/webhook")
  @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(
    StatusCodes.BAD_REQUEST,
    HttpErrorMessages.BAD_REQUEST
  )
  @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    HttpErrorMessages.INTERNAL_SERVER_ERROR
  )
  public static async stripeWebhook(
    @Request() _request: any
  ): Promise<ControllerResponse<IPurchaseModelWithId | ControllerError>> {
    return await PurchasesService.stripeWebhook(_request);
  }
}
