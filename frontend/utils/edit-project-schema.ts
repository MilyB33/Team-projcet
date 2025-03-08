import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const editProjectSchema = z.object({
  name: z.string(),
  accessCode: z.string(),
  description: z.string().optional(),
});

export const editProjectTypedSchema = toTypedSchema(editProjectSchema);
export type EditProjectSchemaValues = z.infer<typeof editProjectSchema>;
