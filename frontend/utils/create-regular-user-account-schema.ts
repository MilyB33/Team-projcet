import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const createRegularAccountSchema = z.object({
  name: z.string().min(1, "Required"),
  surname: z.string().min(1, "Required"),
  email: z.string().email().min(1, "Required"),
  password: z.string().min(8, "Too short"),
});

export const createRegularAccountTypedSchema = toTypedSchema(createRegularAccountSchema);
export type CreateRegularAccountSchemaValues = z.infer<typeof createRegularAccountSchema>;
