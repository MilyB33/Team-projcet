import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const joinProjectSchema = z.object({
  accessCode: z.string(),
});

export const joinProjectTypedSchema = toTypedSchema(joinProjectSchema);
export type JoinProjectSchemaValues = z.infer<typeof joinProjectSchema>;
