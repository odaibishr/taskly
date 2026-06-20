import z from "zod";

export const createEpicSchema = z.object({
	title: z.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be at most 100 characters"),
	description: z.string()
		.max(500, "Description must be at most 500 characters")
		.optional()
		.or(z.literal("")),
	assignee_id: z.string()
		.nullable()
		.optional()
		.or(z.literal("")),
	deadline: z.string()
		.optional()
		.or(z.literal(""))
		.refine((val) => {
			if (!val) return true;
			const selectedDate = new Date(val);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return selectedDate >= today;
		}, "Deadline must be today or in the future"),
});
