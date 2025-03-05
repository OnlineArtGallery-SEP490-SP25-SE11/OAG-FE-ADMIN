import { z } from "zod";
// Updated schema
const editEventSchema = z.object({
  id: z.string(),
  image: z.instanceof(File).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  organizer: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});