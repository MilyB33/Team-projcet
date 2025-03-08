import { toTypedSchema } from "#imports";
import * as z from "zod";

export const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().max(200).optional(),
  workspace: z.number(),
  groups: z.array(z.string()).optional(),
});

export const createProjectTypedSchema = toTypedSchema(createProjectSchema);
export type CreateProjectSchemaValues = z.infer<typeof createProjectSchema>;
