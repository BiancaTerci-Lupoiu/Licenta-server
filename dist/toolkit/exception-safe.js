"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dalExceptionHandler = exports.controllerExceptionHandler = exports.ExceptionSafe = void 0;
const response_factory_1 = require("./response-factory");
const ExceptionSafe = (errorHandler) => {
    return (target) => {
        for (const propertyName of Object.getOwnPropertyNames(target)) {
            const descriptor = Object.getOwnPropertyDescriptor(target, propertyName);
            const isMethod = (descriptor === null || descriptor === void 0 ? void 0 : descriptor.value) instanceof Function;
            if (!isMethod)
                continue;
            Object.defineProperty(target, propertyName, _generateDescriptor(descriptor, errorHandler));
        }
    };
};
exports.ExceptionSafe = ExceptionSafe;
function _generateDescriptor(descriptor, errorHandler) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield originalMethod.apply(this, args);
            }
            catch (error) {
                return errorHandler(error);
            }
        });
    };
    return descriptor;
}
const controllerExceptionHandler = (error) => {
    console.error(error);
    return response_factory_1.ResponseFactory.createInternalServerError(error.toString());
};
exports.controllerExceptionHandler = controllerExceptionHandler;
const dalExceptionHandler = (error) => {
    console.error(error);
    return null;
};
exports.dalExceptionHandler = dalExceptionHandler;
