import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const reportsFiltersSchema = z.object({
  projectId: z.array(z.number()).optional(),
  workspaceId: z.array(z.number()).optional(),
  memberId: z.array(z.number()).optional(),
  datesRange: z
    .array(z.date())
    .length(0, "Must contain 0 or 2 elements")
    .or(z.array(z.date()).length(2, "Must contain 0 or 2 elements"))
    .optional(),
});

export const reportsFiltersTypedSchema = toTypedSchema(reportsFiltersSchema);
export type ReportsFiltersSchemaValues = z.infer<typeof reportsFiltersSchema>;
