"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFactory = exports.ErrorCode = exports.StatusCode = void 0;
const error_message_codes_1 = require("./error-message-codes");
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 403] = "UNAUTHORIZED";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHORIZED"] = "USER-UNAUTHORIZED";
    ErrorCode["BAD_REQUEST"] = "USER-BAD-REQUEST";
    ErrorCode["NOT_FOUND"] = "NOT-FOUND";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL-SERVER-ERROR";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class ResponseFactory {
    static createResponse(responseBody) {
        return {
            statusCode: StatusCode.OK,
            body: responseBody,
        };
    }
    static createError(statusCode, message, errorCode, customProperties) {
        const errorDefaults = {
            [StatusCode.NOT_FOUND]: {
                message: error_message_codes_1.ErrorMessageCode.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
            },
            [StatusCode.BAD_REQUEST]: {
                message: error_message_codes_1.ErrorMessageCode.BAD_REQUEST,
                code: ErrorCode.BAD_REQUEST,
            },
            [StatusCode.UNAUTHORIZED]: {
                message: error_message_codes_1.ErrorMessageCode.UNAUTHORIZED,
                code: ErrorCode.UNAUTHORIZED,
            },
            [StatusCode.INTERNAL_SERVER_ERROR]: {
                message: error_message_codes_1.ErrorMessageCode.INTERNAL_SERVER_ERROR,
                code: ErrorCode.INTERNAL_SERVER_ERROR,
            },
        };
        const errorResponse = {
            statusCode: statusCode,
            body: {
                message: message !== null && message !== void 0 ? message : errorDefaults[statusCode].message,
                code: errorCode !== null && errorCode !== void 0 ? errorCode : errorDefaults[statusCode].code,
            },
        };
        if (customProperties === null || customProperties === void 0 ? void 0 : customProperties.value) {
            errorResponse.body[customProperties.key] = customProperties.value;
        }
        return errorResponse;
    }
    static createBadRequestError(message, formFieldErrors, errorCode) {
        const customProperties = {
            key: "formFieldErrors",
            value: formFieldErrors,
        };
        return this.createError(StatusCode.BAD_REQUEST, message, errorCode, customProperties);
    }
    static createUnauthorizedError(message, errorCode) {
        return this.createError(StatusCode.UNAUTHORIZED, message, errorCode);
    }
    static createInternalServerError(message, errorCode) {
        return this.createError(StatusCode.INTERNAL_SERVER_ERROR, message, errorCode);
    }
    static createNotFoundError(message, errorCode) {
        return this.createError(StatusCode.NOT_FOUND, message, errorCode);
    }
}
exports.ResponseFactory = ResponseFactory;
