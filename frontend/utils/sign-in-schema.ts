import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Must be a valid email" }).min(1, "Required"),
  password: z.string().min(8, "Too short"),
});

export const signInTypedSchema = toTypedSchema(signInSchema);
export type SignInSchemaValues = z.infer<typeof signInSchema>;
