import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const editTimeEntrySchema = z.object({
  description: z.string(),
  project: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

export const editTimeEntryTypedSchema = toTypedSchema(editTimeEntrySchema);
export type EditTimeEntrySchemaValues = z.infer<typeof editTimeEntrySchema>;
