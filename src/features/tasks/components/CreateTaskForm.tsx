import type z from "zod";
import type { createTaskSchema } from "@/features/tasks/validation";

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

const statusOptions = [
    { value: "TO_DO", label: "TO DO" },
    { value: "IN_PROGRESS", label: "IN PROGRESS" },
    { value: "BLOCKED", label: "BLOCKED" },
    { value: "IN_REVIEW", label: "IN REVIEW" },
    { value: "READY_FOR_QA", label: "READY FOR QA" },
    { value: "REOPENED", label: "REOPENED" },
    { value: "READY_FOR_PRODUCTION", label: "READY FOR PRODUCTION" },
    { value: "DONE", label: "DONE" },
];

const CreateTaskForm = () => {
    return <div>CreateTaskForm</div>;
};

export default CreateTaskForm;
