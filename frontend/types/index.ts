export type LoginRequest = {
  email: string;
  password: string;
};

export type AccountType = "standard" | "employer";

export type LoginResponse = {
  accessToken: string;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
  account_type: AccountType;
};

export type CreateUserResponse = {
  message: string;
};
