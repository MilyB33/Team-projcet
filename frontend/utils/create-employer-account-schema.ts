import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const createEmployerAccountSchema = z.object({
  name: z.string().min(1, "Required"),
  surname: z.string().min(1, "Required"),
  company: z.string().min(1, "Required"),
  email: z.string().email().min(1, "Required"),
  password: z.string().min(8, "Too short"),
});

export const createEmployerAccountTypedSchema = toTypedSchema(createEmployerAccountSchema);
export type CreateEmployerAccountSchemaValues = z.infer<typeof createEmployerAccountSchema>;
