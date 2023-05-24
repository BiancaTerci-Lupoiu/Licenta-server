export interface IConfig {
  port: number | string;
  connectionString: string;
  geocoderProvider: string;
  geocoderApiKey: string;
  secretToken: string;
  jwtExpire: string;
  smtpHost: string;
  smtpPort: number | string;
  smtpEmail: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  clientUrl: string;
  stripeKey: string;
  urlBackend: string;
  urlFrontend: string;
  urlFiltersServer: string;
  sendgridApiKey: string;
}
