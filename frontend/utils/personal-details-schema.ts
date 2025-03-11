import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const personalDetailsSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required"),
  lastName: z.string()
    .min(1, "Last name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  accountType: z.string().default("IT engineer"),
});

export const personalDetailsTypedSchema = toTypedSchema(personalDetailsSchema);
export type PersonalDetailsSchemaValues = z.infer<typeof personalDetailsSchema>;
