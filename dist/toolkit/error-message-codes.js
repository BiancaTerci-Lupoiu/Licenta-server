"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrorMessages = exports.ErrorMessageCode = void 0;
var ErrorMessageCode;
(function (ErrorMessageCode) {
    ErrorMessageCode["NOT_FOUND"] = "NOT-FOUND";
    ErrorMessageCode["BAD_REQUEST"] = "BAD-REQUEST";
    ErrorMessageCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorMessageCode["INTERNAL_SERVER_ERROR"] = "INTERNAL-SERVER-ERROR";
})(ErrorMessageCode = exports.ErrorMessageCode || (exports.ErrorMessageCode = {}));
var HttpErrorMessages;
(function (HttpErrorMessages) {
    HttpErrorMessages["NOT_FOUND"] = "Not found";
    HttpErrorMessages["INTERNAL_SERVER_ERROR"] = "Internal server error";
    HttpErrorMessages["BAD_REQUEST"] = "Bad request";
    HttpErrorMessages["UNAUTHORIZED"] = "Not authorized";
})(HttpErrorMessages = exports.HttpErrorMessages || (exports.HttpErrorMessages = {}));
