import NodeGeocoder, { Options } from "node-geocoder";
import { config } from "../../config";

const options: Options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: config.geocoderApiKey,
  formatter: "%n, %S, %C,",
};

console.log(config.geocoderApiKey);

const geocoder = NodeGeocoder(options);

export default geocoder;
