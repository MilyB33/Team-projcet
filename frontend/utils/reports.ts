import type { WorkspacesReport } from "~/types";

export const workspacesReportsTableHeaders = [
  {
    title: "Lp.",
    sortable: true,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "Hours",
    sortable: true,
    key: "hours",
  },
];

export const workspacesReportsProjectsTableHeaders = [
  {
    title: "Lp.",
    sortable: true,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "Admin",
    sortable: false,
    key: "admin",
  },
  {
    title: "Workspace",
    sortable: false,
    key: "workspace",
  },
  {
    title: "Hours",
    sortable: true,
    key: "hours",
  },
];

export const workspacesReportsMembersTableHeaders = [
  {
    title: "Lp.",
    sortable: true,
    key: "lp",
  },
  {
    title: "Name",
    sortable: false,
    key: "name",
  },
  {
    title: "Email",
    sortable: false,
    key: "email",
  },
  {
    title: "Project",
    sortable: false,
    key: "project",
  },
  {
    title: "Hours",
    sortable: true,
    key: "hours",
  },
];

export const prepareWorkspacesReportsTableData = (reportData?: WorkspacesReport) => {
  if (!reportData) {
    return {
      workspaces: [],
    };
  }

  const workspaces = reportData.workspaces.map((workspace, index) => ({
    id: workspace.id,
    lp: index + 1,
    name: workspace.name,
    hours: workspace.totalTime,
  }));

  const projects = reportData.projects.map((project, index) => ({
    id: project.id,
    lp: index + 1,
    name: project.name,
    admin: project.admin.email,
    workspace: project.workspace.name,
    hours: project.totalTime,
  }));

  const members = reportData.members.map((member, index) => ({
    id: member.id,
    lp: index + 1,
    name: `${member.user.first_name} ${member.user.last_name}`,
    email: member.user.email,
    project: member.project.name,
    hours: member.totalTime,
  }));

  return {
    workspaces,
    projects,
    members,
  };
};
