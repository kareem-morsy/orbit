import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Use at least 3 characters").max(80),
  description: z.string().min(10, "Add a clearer description").max(240),
  status: z.enum(["planning", "active", "completed"]),
  dueDate: z.string().min(1, "Choose a due date"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
