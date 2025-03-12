import { toTypedSchema } from "#imports";
import * as z from "zod";

export const updateEmployerAccountDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  company: z.string(),
  email: z.string().email(),
});

export const updateEmployerAccountDetailsTypedSchema = toTypedSchema(
  updateEmployerAccountDetailsSchema,
);
export type UpdateEmployerAccountDetailsSchemaValues = z.infer<
  typeof updateEmployerAccountDetailsSchema
>;

export const updateStandardAccountDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export const updateStandardAccountDetailsTypedSchema = toTypedSchema(
  updateStandardAccountDetailsSchema,
);
export type UpdateStandardAccountDetailsSchemaValues = z.infer<
  typeof updateStandardAccountDetailsSchema
>;
