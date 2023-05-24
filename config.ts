import { IConfig } from "./types/interfaces/config.interface";
import "dotenv/config";

export const config: IConfig = {
  port: process.env.port || 8081,
  connectionString: process.env.connection_string || "hsdjsd",
  geocoderProvider: process.env.geocoder_provider || "provider",
  geocoderApiKey: process.env.geocoder_api_key || "key",
  secretToken: process.env.secret_token || "secret_token",
  jwtExpire: process.env.jwt_expire || "expiration_date",
  smtpHost: process.env.smtp_host || "localhost",
  smtpPort: process.env.smtp_port || 1234,
  smtpEmail: process.env.smtp_email || "email",
  smtpPassword: process.env.smtp_password || "password",
  fromEmail: process.env.from_email || "email",
  fromName: process.env.from_name || "name",
  clientUrl: process.env.client_url || "",
  stripeKey: process.env.stripe_key || "",
  urlBackend: process.env.url_backend || "",
  sendgridApiKey: process.env.sendgrid_api_key || "",
  urlFrontend: process.env.url_frontend || "",
  urlFiltersServer: process.env.url_filters_server || "",
};
