import { z } from "zod";
import { EventStatus } from "@/utils/enums";
export const eventSchema = z.object({
  image: z.string().url().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  type: z.string().nonempty(),
  status: z.nativeEnum(EventStatus),
  organizer: z.string().nonempty(),
  startDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
});

export type EventForm = z.infer<typeof eventSchema>;
