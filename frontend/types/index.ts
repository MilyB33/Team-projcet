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
  projectsCount: number;
};

export type CreateWorkspaceRequest = {
  user_id: number;
  name: string;
};

export type UpdateWorkspaceRequest = {
  name: string;
  id: number;
};

export type Group = {
  id: number;
  name: string;
  projectId: number;
  project: Project;
};

export type ProjectGroup = {
  id: number;
  projectUserId: number;
  groupId: number;
  joinedAt: Date;
  projectUser: ProjectUser;
  group: Group[];
};

export type ProjectUser = {
  id: number;
  projectId: number;
  userId: number;
  joinedAt: Date;
  project: Project;
  user: Pick<User, "id" | "first_name" | "last_name" | "email">;
  groups: ProjectGroup[];
};

export type Project = {
  id: number;
  name: string;
  description: string;
  workspaceId: number;
  createdBy: number;
  createdAt: Date;
  accessCode: string;
  workspace: Omit<Workspace, "admin" | "projectCount">;
  admin: User;
  members: ProjectUser[];
  groups: ProjectGroup[];
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  workspaceId: number;
  groups: { name: string }[];
};

export type UpdateProjectRequest = Partial<Omit<CreateProjectRequest, "workspaceId">> & {
  id: number;
};

export type TimeEntry = {
  id: number;
  projectId: number;
  createdAt: Date;
  description: string;
  endTime: Date;
  startTime: Date;
  userId: number;
};

type WorkspacesReportWorkspace = {
  id: number;
  name: string;
  projects: { time_entries: TimeEntry[] }[];
  totalTime: string;
};

type WorkspacesReportProject = {
  id: number;
  admin: User;
  time_entries: TimeEntry[];
  name: string;
  workspace: Pick<Workspace, "id" | "name">;
  totalTime: string;
};

type WorkspacesReportMember = {
  id: number;
  project: Pick<WorkspacesReportProject, "id" | "name">;
  user: User;
  totalTime: string;
};

export type WorkspacesReport = {
  workspaces: WorkspacesReportWorkspace[];
  projects: WorkspacesReportProject[];
  members: WorkspacesReportMember[];
};
