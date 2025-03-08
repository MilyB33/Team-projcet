import { toTypedSchema } from "#imports";
import * as z from "zod";

export const timerSchema = z.object({
  project: z.number(),
  description: z.string(),
});

export const timerTypedSchema = toTypedSchema(timerSchema);
export type TimerSchemaValues = z.infer<typeof timerSchema>;
