import moment from "moment";

import type {
  EmployeeProjectsReport,
  MembersReport,
  ProjectsReport,
  TimeEntry,
  WorkspacesReport,
  WorkspacesReportMember,
  WorkspacesReportProject,
} from "~/types";

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

export const employeeReportsTimeEntriesTableHeaders = [
  {
    title: "Lp.",
    sortable: true,
    key: "lp",
  },
  {
    title: "Project",
    sortable: false,
    key: "project",
  },
  {
    title: "Description",
    sortable: false,
    key: "description",
  },
  {
    title: "Start time",
    sortable: false,
    key: "startTime",
  },
  {
    title: "End time",
    sortable: false,
    key: "endTime",
  },
  {
    title: "Hours",
    sortable: true,
    key: "hours",
  },
];

export const membersReportsTimeEntriesTableHeaders = [
  {
    title: "Lp.",
    sortable: true,
    key: "lp",
  },
  {
    title: "Project",
    sortable: false,
    key: "project",
  },
  {
    title: "Member",
    sortable: false,
    key: "member",
  },
  {
    title: "Description",
    sortable: false,
    key: "description",
  },
  {
    title: "Start time",
    sortable: false,
    key: "startTime",
  },
  {
    title: "End time",
    sortable: false,
    key: "endTime",
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
      projects: [],
      members: [],
    };
  }

  const workspaces = reportData.workspaces.map((workspace, index) => ({
    id: workspace.id,
    lp: index + 1,
    name: workspace.name,
    hours: workspace.totalTime,
  }));

  const projects = mapProjects(reportData.projects);

  const members = mapMembers(reportData.members);

  return {
    workspaces,
    projects,
    members,
  };
};

export const prepareProjectsReportsTableData = (reportData?: ProjectsReport) => {
  if (!reportData) {
    return {
      projects: [],
      members: [],
    };
  }

  const projects = mapProjects(reportData.projects);

  const members = mapMembers(reportData.members);

  return {
    projects,
    members,
  };
};

export const prepareMembersReportsTableData = (reportData?: MembersReport) => {
  if (!reportData) {
    return {
      members: [],
      timeEntries: [],
    };
  }

  const members = mapMembers(reportData.members);

  const timeEntries = mapTimeEntries(reportData.timeEntries);

  return {
    members,
    timeEntries,
  };
};

export const prepareEmployeeProjectsReportsTableData = (reportData?: EmployeeProjectsReport) => {
  if (!reportData) {
    return {
      projects: [],
      timeEntries: [],
    };
  }
  // @ts-expect-error type is wrong
  const projects = mapProjects(reportData.projects);

  const timeEntries = mapTimeEntries(reportData.timeEntries);

  return {
    projects,
    timeEntries,
  };
};

const mapProjects = (projects: WorkspacesReportProject[]) => {
  return projects.map((project, index) => ({
    id: project.id,
    lp: index + 1,
    name: project.name,
    admin: project?.admin?.email,
    workspace: project.workspace.name,
    hours: project.totalTime,
  }));
};

const mapMembers = (members: WorkspacesReportMember[]) => {
  return members.map((member, index) => ({
    id: member.id,
    lp: index + 1,
    name: `${member.user.first_name} ${member.user.last_name}`,
    email: member.user.email,
    project: member.project.name,
    hours: member.totalTime,
  }));
};

const mapTimeEntries = (timeEntries: TimeEntry[]) => {
  return timeEntries.map((timeEntry, index) => ({
    id: timeEntry.id,
    lp: index + 1,
    project: timeEntry.projectUser.project.name,
    member: timeEntry?.projectUser?.user?.email,
    description: timeEntry.description,
    startTime: moment(timeEntry.startTime).format("DD-MM-YYYY HH:mm:ss"),
    endTime: moment(timeEntry.endTime).format("DD-MM-YYYY HH:mm:ss"),
    hours: timeEntry.totalTime,
  }));
};
