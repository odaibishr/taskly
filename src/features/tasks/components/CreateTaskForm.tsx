import type z from "zod";
import { createTaskSchema } from "@/features/tasks/validation";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTasksStore } from "@/features/tasks/store/tasks.store";
import { useProjectMembers } from "@/features/members/store/members.store";
import { useEpicsStore } from "@/features/epics";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams] = useSearchParams();
    const prefilledEpicId = searchParams.get("epicId") || "";

    const { createTask, isLoading, error, clearError } = useTasksStore();
    const { members } = useProjectMembers();

    const { epics, getEpicsByProjectId } = useEpicsStore();

    useEffect(() => {
        if (projectId) {
            getEpicsByProjectId(projectId);
        }
        return () => {
            clearError();
        };
    }, [projectId, getEpicsByProjectId, clearError]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: "",
            description: "",
            epic_id: prefilledEpicId,
            assignee_id: "",
            due_date: "",
            status: "TO_DO",
        },
    });

    const onSubmit = async (data: CreateTaskFormData) => {
        if (!projectId) return;
        let isoDueDate: string | null = null;
        if (data.due_date) {
            isoDueDate = new Date(data.due_date).toISOString();
        }
        try {
            await createTask({
                project_id: projectId,
                epic_id: data.epic_id || null,
                title: data.title,
                description: data.description || null,
                assignee_id: data.assignee_id || null,
                due_date: isoDueDate,
                status: data.status,
            });
            navigate(`/project/${projectId}/epics`);
        } catch {}
    };

    return <div>CreateTaskForm</div>;
};

export default CreateTaskForm;
