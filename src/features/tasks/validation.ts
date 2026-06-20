import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be at most 100 characters"),
    description: z.string()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .or(z.literal("")),
    epic_id: z.string()
        .optional()
        .or(z.literal("")),
    assignee_id: z.string()
        .optional()
        .or(z.literal("")),
    due_date: z.string()
        .optional()
        .or(z.literal("")),
    status: z.enum([
        "TO_DO",
        "IN_PROGRESS",
        "BLOCKED",
        "IN_REVIEW",
        "READY_FOR_QA",
        "REOPENED",
        "READY_FOR_PRODUCTION",
        "DONE"
    ])
})