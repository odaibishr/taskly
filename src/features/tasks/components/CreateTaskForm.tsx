import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import z from "zod";

import { useEpicsStore } from "@/features/epics";
import { useProjectMembers } from "@/features/members/hooks/useProjectMembers";
import { useTasksStore } from "@/features/tasks/store/tasks.store";
import type { TaskStatus } from "@/features/tasks/types";
import { createTaskSchema } from "@/features/tasks/validation";
import Button from "@/shared/components/Button";
import FormContainer from "@/shared/components/FormContainer";
import Input from "@/shared/components/Input";
import Select from "@/shared/components/Select";
import Textarea from "@/shared/components/Textarea";

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

    const from = searchParams.get("from");
    const redirectUrl = from === "board" ? `/project/${projectId}/tasks` : `/project/${projectId}/epics`;

    const statusParam = searchParams.get("status");
    const prefilledStatus = (statusParam && [
        "TO_DO",
        "IN_PROGRESS",
        "BLOCKED",
        "IN_REVIEW",
        "READY_FOR_QA",
        "REOPENED",
        "READY_FOR_PRODUCTION",
        "DONE"
    ].includes(statusParam)) ? (statusParam as TaskStatus) : "TO_DO";

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
            status: prefilledStatus,
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
            navigate(redirectUrl);
        } catch {
            // Note: The error is automatically caught by useTasksStore and handled gracefully in the UI.
        }
    };

    const epicOptions = useMemo(() => {
        return epics.map((epic) => {
            const truncatedTitle =
                epic.title.length > 100 ? epic.title.substring(0, 100) + "..." : epic.title;
            return {
                value: epic.id,
                label: `${epic.epic_id} ${truncatedTitle}`,
            };
        });
    }, [epics]);

    const memberOptions = useMemo(() => {
        return members.map((member) => {
            const name = member.name || member.email.split("@")[0];
            return {
                value: member.id,
                label: `${name} (${member.role})`,
            };
        });
    }, [members]);

    return (
        <FormContainer className="max-w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    register={register}
                    name="title"
                    placeholder="Enter the task title..."
                    error={errors.title}
                    label="Task Title"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Select
                        name="status"
                        placeholder="TO DO"
                        register={register}
                        options={statusOptions}
                        error={errors.status}
                        label="Status"
                    />

                    <Select
                        name="assignee_id"
                        placeholder="Unassigned"
                        register={register}
                        options={memberOptions}
                        error={errors.assignee_id}
                        label="Assignee"
                    />
                </div>

                <Select
                    name="epic_id"
                    placeholder="Select Epic Link"
                    register={register}
                    options={epicOptions}
                    error={errors.epic_id}
                    label="Epic"
                />

                <Input
                    name="due_date"
                    type="datetime-local"
                    placeholder="Select due date and time"
                    register={register}
                    error={errors.due_date}
                    label="Due Date"
                />

                <Textarea
                    name="description"
                    placeholder="Enter task description"
                    register={register}
                    error={errors.description}
                    label="Task Description"
                    maxLength={500}
                    optional
                    // eslint-disable-next-line react-hooks/incompatible-library
                    value={watch("description")}
                />

                <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(redirectUrl)}
                        className="sm:w-fit w-full"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="sm:w-fit w-full"
                        disabled={isLoading}
                    >
                        Create
                    </Button>
                </div>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
                        {error}
                    </div>
                )}
            </form>
        </FormContainer>
    );
};

export default CreateTaskForm;
