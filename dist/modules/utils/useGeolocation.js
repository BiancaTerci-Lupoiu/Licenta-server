"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useGeoLocation = () => {
    const [location, setLocation] = (0, react_1.useState)({
        loaded: false,
        coordinates: { lat: "", long: "" },
    });
};
exports.default = useGeoLocation;
