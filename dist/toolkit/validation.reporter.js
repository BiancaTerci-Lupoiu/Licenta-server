"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonErrorCodes = exports.validationReporter = void 0;
const express_validator_1 = require("express-validator");
const response_factory_1 = require("./response-factory");
function validationReporter(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errorMessages = result.array().map((error) => error.msg);
        const response = response_factory_1.ResponseFactory.createBadRequestError(errorMessages.join(";"));
        return res.status(response.statusCode).send(response.body);
    }
    next();
}
exports.validationReporter = validationReporter;
var CommonErrorCodes;
(function (CommonErrorCodes) {
    CommonErrorCodes["TOO_LONG"] = "too long";
    CommonErrorCodes["TOO_SHORT"] = "too short";
    CommonErrorCodes["REQUIRED"] = "required";
    CommonErrorCodes["NOT_FOUND"] = "not found";
    CommonErrorCodes["NOT_EXIST"] = "not exist";
    CommonErrorCodes["NOT_VALID_FORMAT"] = "not valid format";
    CommonErrorCodes["ALREADY_EXISTS"] = "already exists";
    CommonErrorCodes["NOT_EMPTY"] = "not empty";
    CommonErrorCodes["NOT_VALID_VALUE"] = "not valid value";
})(CommonErrorCodes = exports.CommonErrorCodes || (exports.CommonErrorCodes = {}));
