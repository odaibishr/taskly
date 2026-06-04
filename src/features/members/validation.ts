import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
