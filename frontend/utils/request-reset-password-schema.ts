import { toTypedSchema } from "#imports";
import * as z from "zod";

export const requestResetPasswordSchema = z.object({
  email: z.string().email().min(1, "Required"),
});

export const requestResetPasswordTypedSchema = toTypedSchema(requestResetPasswordSchema);
export type RequestResetPasswordSchemaValues = z.infer<typeof requestResetPasswordSchema>;
