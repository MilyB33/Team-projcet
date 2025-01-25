import type { Workspace } from "~/types";

export const tableHeaders = [
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
    title: "Projects count",
    sortable: false,
    key: "projects",
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

export const prepareTableData = (workspaces: Workspace[]) => {
  return workspaces.map((workspace, index) => {
    return {
      id: workspace.id,
      lp: index + 1,
      name: workspace.name,
      projects: 2,
      creationDate: new Date(workspace.createdAt).toLocaleDateString(),
    };
  });
};
