import { create } from "zustand";

import { createTask, fetchTaskDetails, fetchTasksByEpicId, fetchTasksByProjectId, updateTaskStatus as updateTaskStatusApi } from "@/features/tasks/api/tasks.api";
import type { CreateTaskPayload, ProjectTask, Task, TaskStatus } from "@/features/tasks/types";

interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    createTask: (payload: CreateTaskPayload) => Promise<void>;
    epicTasks: ProjectTask[];
    isEpicTasksLoading: boolean;
    epicTasksError: string | null;
    selectedTaskId: string | null;
    selectedTask: ProjectTask | null;
    selectedTaskError: string | null;
    isSelectedTaskLoading: boolean;
    isSelectedTaskError: boolean;
    setSelectedTaskId: (taskId: string | null) => void;
    getSelectedTaskDetails: (projectId: string, taskId: string) => Promise<void>;
    getEpicTasks: (epicId: string) => Promise<void>;
    clearEpicTasks: () => void;
    projectTasks: ProjectTask[];
    totalTasks: number;
    isProjectTasksLoading: boolean;
    projectTasksError: string | null;
    getProjectTasks: (projectId: string, limit?: number, offset?: number, append?: boolean) => Promise<void>;
    clearProjectTasks: () => void;
    updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
}

export const useTasksStore = create<TasksState>()((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    createTask: async (payload: CreateTaskPayload) => {
        set({
            isLoading: true,
            error: null,
        })

        try {
            const data = await createTask(payload);
            set({
                tasks: [...get().tasks, data],
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create task";
            set({
                error: message,
            });
            throw new Error(message);
        } finally {
            set({
                isLoading: false,
            });
        }
    },
    clearError: () => set({ error: null }),
    epicTasks: [],
    isEpicTasksLoading: false,
    epicTasksError: null,
    getEpicTasks: async (epicId: string) => {
        set({
            isEpicTasksLoading: true,
            epicTasksError: null,
        });
        try {
            const data = await fetchTasksByEpicId(epicId);
            set({
                epicTasks: data,
            });
        } catch {
            set({
                epicTasksError: "Failed to load tasks",
            });
        } finally {
            set({
                isEpicTasksLoading: false,
            });
        }
    },
    clearEpicTasks: () => set({ epicTasks: [], epicTasksError: null }),
    projectTasks: [],
    totalTasks: 0,
    isProjectTasksLoading: false,
    projectTasksError: null,
    getProjectTasks: async (projectId: string, limit?: number, offset?: number, append: boolean = false) => {
        set({
            isProjectTasksLoading: true,
            projectTasksError: null,
        });
        try {
            const { data, total } = await fetchTasksByProjectId(projectId, limit, offset);
            set({
                projectTasks: append
                    ? [
                        ...get().projectTasks,
                        ...data.filter(
                            (newTask) => !get().projectTasks.some((t) => t.id === newTask.id)
                        ),
                    ]
                    : data,
                totalTasks: total,
            });
        } catch {
            set({
                projectTasksError: "Failed to load project tasks",
            });
        } finally {
            set({
                isProjectTasksLoading: false,
            });
        }
    },
    clearProjectTasks: () => set({ projectTasks: [], totalTasks: 0, projectTasksError: null }),
    /**
     * Updates a task's status optimistically on the board.
     * Throws the backend API error to allow callers to handle toast notifications.
     */
    updateTaskStatus: async (taskId: string, status: TaskStatus) => {
        const originalTasks = get().projectTasks;


        const updatedTasks = originalTasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
        );
        set({ projectTasks: updatedTasks });


        const selectedTask = get().selectedTask;
        if (selectedTask && selectedTask.id === taskId) {
            set({ selectedTask: { ...selectedTask, status } });
        }

        try {
            await updateTaskStatusApi(taskId, status);
        } catch (error) {

            set({ projectTasks: originalTasks });
            if (selectedTask && selectedTask.id === taskId) {
                set({ selectedTask });
            }
            throw error;
        }
    },
    selectedTaskId: null,
    selectedTask: null,
    selectedTaskError: null,
    isSelectedTaskLoading: false,
    isSelectedTaskError: false,
    setSelectedTaskId: (taskId) => set({
        selectedTaskId: taskId,
        selectedTask: taskId ? get().selectedTask : null,
        selectedTaskError: null,
    }),
    getSelectedTaskDetails: async (projectId, taskId) => {
        set({
            isSelectedTaskLoading: true,
            selectedTaskError: null,
        });
        try {
            const data = await fetchTaskDetails(projectId, taskId);
            set({
                selectedTask: data,
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to load task details";
            set({
                selectedTaskError: message,
            });
        } finally {
            set({
                isSelectedTaskLoading: false,
            });
        }
    }

}))