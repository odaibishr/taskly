import z from "zod";

export const createProjectSchema = z.object({
	name: z.string().min(3, "Project name must be at least 3 characters")
		.max(100, "Project name must be at most 100 characters"),
	description: z.string()
		.min(5, "Project description must be at least 5 characters")
		.max(500, "Project description must be at most 500 characters")
		.optional()
		.or(z.literal('')),
	
});