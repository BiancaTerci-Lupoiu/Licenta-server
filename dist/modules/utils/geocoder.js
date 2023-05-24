"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_geocoder_1 = __importDefault(require("node-geocoder"));
const config_1 = require("../../config");
const options = {
    provider: "mapquest",
    httpAdapter: "https",
    apiKey: config_1.config.geocoderApiKey,
    formatter: "%n, %S, %C,",
};
console.log(config_1.config.geocoderApiKey);
const geocoder = (0, node_geocoder_1.default)(options);
exports.default = geocoder;
