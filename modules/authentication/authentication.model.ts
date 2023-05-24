import { IUserModelWithoutSensitiveInfo } from "../users/users.models";

export interface LoginUserRequestBody {
  email: string;
  password: string;
}

export interface LoginUserResponseBody {
  token: string;
  user: IUserModelWithoutSensitiveInfo;
}

export interface RegisterUserResponseBody {
  message: string;
}
