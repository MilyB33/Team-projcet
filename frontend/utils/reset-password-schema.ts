import { toTypedSchema } from "#imports";
import * as z from "zod";

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(1, "Required"),
});

export const resetPasswordTypedSchema = toTypedSchema(resetPasswordSchema);
export type ResetPasswordSchemaValues = z.infer<typeof resetPasswordSchema>;
