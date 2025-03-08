import moment from "moment";
import type { CreateProjectRequest, Project, ProjectUser, User, Workspace } from "~/types";

export const prepareWorkspacesItems = (workspaces: Workspace[]) => {
  return workspaces.map((workspace) => ({
    title: workspace.name,
    value: workspace.id,
  }));
};

export const prepareCreateProjectData = (
  values: CreateProjectSchemaValues,
): CreateProjectRequest => {
  const groups =
    values.groups?.map((group) => ({
      name: group,
    })) || [];

  return {
    name: values.name,
    description: values.description,
    workspaceId: values.workspace,
    groups,
  };
};

export const projectsTableHeaders = [
  {
    title: "Lp.",
    sortable: false,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "Workspace",
    sortable: false,
    key: "workspace",
  },
  {
    title: "Access code",
    sortable: false,
    key: "accessCode",
  },
  {
    title: "Members count",
    sortable: false,
    key: "members",
  },
  {
    title: "Created at",
    sortable: false,
    key: "creationDate",
  },
  {
    title: "Actions",
    sortable: false,
    key: "actions",
  },
];

export const prepareProjectsTableData = (projects: Project[]) => {
  return projects.map((project, index) => {
    return {
      id: project.id,
      lp: index + 1,
      name: project.name,
      members: project.members.length,
      creationDate: new Date(project.createdAt).toLocaleDateString(),
      workspace: project.workspace.name,
      accessCode: project.accessCode,
    };
  });
};

export const projectMembersHeaders = [
  {
    title: "Lp.",
    sortable: false,
    key: "lp",
  },
  {
    title: "First name",
    sortable: false,
    key: "firstName",
  },
  {
    title: "Last name",
    sortable: false,
    key: "lastName",
  },
  {
    title: "Email",
    sortable: false,
    key: "email",
  },
  {
    title: "Joined at",
    sortable: false,
    key: "joinedDate",
  },
  {
    title: "Actions",
    sortable: false,
    key: "actions",
  },
] as const;

export const prepareProjectsMembersData = (members: Project["members"]) => {
  return members.map((member, index) => {
    return {
      id: member.id,
      userId: member.user.id,
      lp: index + 1,
      firstName: member.user.first_name,
      lastName: member.user.last_name,
      email: member.user.email,
      joinedDate: moment(member.joinedAt).format("MMMM Do YYYY"),
    };
  });
};

export const employeeProjectsTableHeaders = [
  {
    title: "Lp.",
    sortable: false,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "Members count",
    sortable: false,
    key: "members",
  },
  {
    title: "Joined at",
    sortable: false,
    key: "joinedAt",
  },
  {
    title: "Actions",
    sortable: false,
    key: "actions",
  },
];

export const prepareEmployeeProjectsTableData = (projects: Project[], user: User) => {
  return projects.map((project, index) => {
    const joinedAt = project.members.find((member) => member.userId === user.id)?.joinedAt;

    return {
      id: project.id,
      lp: index + 1,
      name: project.name,
      members: project.members.length,
      joinedAt: moment(joinedAt).format("MMMM Do YYYY"),
    };
  });
};

export const employerActiveMembersTableHeaders = [
  {
    title: "Lp.",
    sortable: false,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "email",
    sortable: false,
    key: "email",
  },
  {
    title: "Start time",
    sortable: false,
    key: "startTime",
  },
  {
    title: "Hours",
    sortable: false,
    key: "hours",
  },
];

export const prepareEmployerActiveMembersTableData = (members: ProjectUser[]) => {
  console.log(members);
  return members.map((member, index) => ({
    lp: index + 1,
    name: `${member.user.first_name} ${member.user.last_name}`,
    email: member.user.email,
    startTime: member.time_entries[0].startTime,
    hours: member.totalTime,
  }));
};
