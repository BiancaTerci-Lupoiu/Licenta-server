import { IUserModelWithoutSensitiveInfo } from "../../modules/users/users.models";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  // added a new field to Request to use in authorization middleware
  namespace Express {
    export interface Request {
      authenticatedUser?: IUserModelWithoutSensitiveInfo;
    }
  }
}
