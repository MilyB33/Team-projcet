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

export type User = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  first_name: string;
  last_name: string;
  company?: string;
  typeId: number;
  type: {
    id: number;
    name: string;
  };
  email: string;
};

export type Workspace = {
  id: number;
  createdAt: Date;
  created_by: number;
  name: string;
  admin: User;
};

export type CreateWorkspaceRequest = {
  user_id: number;
  name: string;
};

export type UpdateWorkspaceRequest = {
  name: string;
  id: number;
};
