import { toTypedSchema } from "#imports";
import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string(),
});

export const createWorkspaceSchemaTypedSchema = toTypedSchema(createWorkspaceSchema);
export type CreateWorkspaceSchemaValues = z.infer<typeof createWorkspaceSchema>;
