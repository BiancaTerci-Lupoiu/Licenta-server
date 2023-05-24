export enum UserRoles {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUserModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRoles;
  address?: Address;
  iban?: string;
  picture?: string;
  status: AccountStatus;
  confirmationToken: string;
}

export enum AccountStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
}

export interface IUserModelWithId extends IUserModel {
  _id: string;
}

export type IUserModelWithoutSensitiveInfo = Omit<
  IUserModelWithId,
  "password" | "confirmationToken" | "status"
>;

export interface AddUserBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: Address;
  iban?: string;
}

export interface AddUserBodyWithRegistrationToken extends AddUserBody {
  confirmationToken: string;
}
export interface UpdateUserBody {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: Address;
  iban?: string;
  picture?: string;
}

export interface NewUser {
  name: string;
  email: string;
  role: UserRoles;
}

export interface Address {
  locality: string;
  city: string;
  street: string;
  number: number;
  zipCode: number;
  coordinates?: { latitude: number; longitude: number };
}
