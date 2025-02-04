import type { CreateProjectRequest, Project, Workspace } from "~/types";

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
      members: 1,
      creationDate: new Date(project.createdAt).toLocaleDateString(),
      workspace: project.workspace.name,
      accessCode: project.accessCode,
    };
  });
};
