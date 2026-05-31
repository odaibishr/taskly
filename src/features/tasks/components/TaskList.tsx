import { AlertCircle, Calendar, List, MoreVertical, Plus, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import type { ProjectTask } from "@/features/tasks/types";
import Button from "@/shared/components/Button";
import { formatDueDate, getInitials } from "@/shared/lib/utils";

interface TaskListProps {
    tasks: ProjectTask[];
    isLoading: boolean;
    error: string | null;
    projectId: string;
    epicId: string;
    onRetry: () => void;
}

// Helper to check if a task is overdue
const isTaskOverdue = (dueDateString?: string | null, status?: string) => {
    if (!dueDateString || status === "DONE") return false;
    const dueDate = new Date(dueDateString);
    if (isNaN(dueDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
};

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    error,
    projectId,
    epicId,
    onRetry,
}) => {
    const navigate = useNavigate();

    if (isLoading) {
        return <TasksSkeleton />;
    }

    if (error) {
        return (
            <div className="p-6 border border-red-100 bg-red-50/50 rounded-lg text-center space-y-3">
                <p className="text-sm font-semibold text-red-600">Failed to load tasks</p>
                <button
                    onClick={onRetry}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-[#F1F3FF] rounded-lg text-center space-y-7 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-[#D7E2FF] rounded-lg flex items-center justify-center shadow-sm">
                    <List className="w-6 h-6 text-slate-medium" />
                </div>
                <p className="text-sm font-medium text-slate-dark">No tasks found for this epic</p>
                <Button
                    variant="primary"
                    onClick={() => navigate(`/project/${projectId}/tasks/new?epicId=${epicId}`)}
                >
                    <Plus size={18} />
                    <span className="text-sm font-semibold">Add Task</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <div className="hidden sm:block w-full bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-5 hover:bg-slate-50/30 transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Checkmark Circle on the Left */}
                            <div className="w-6 h-6 rounded-full border border-slate-medium/40 flex items-center justify-center text-slate-medium/70 shrink-0 select-none">
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <div className="flex flex-col gap-1.5 min-w-0">
                                <h4
                                    className="text-base font-bold text-slate-dark leading-tight truncate hover:text-primary transition-colors cursor-pointer"
                                    title={task.title}
                                >
                                    {task.title}
                                </h4>

                                <div className="flex items-center gap-2">
                                    {task.assignee_name ? (
                                        <>
                                            {task.assignee_avatar ? (
                                                <img
                                                    src={task.assignee_avatar}
                                                    alt={task.assignee_name}
                                                    className="w-6 h-6 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-[#DAE2FF] flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                                                    {getInitials(task.assignee_name)}
                                                </div>
                                            )}
                                            <span
                                                className="text-xs font-semibold text-slate-medium/80 truncate max-w-40"
                                                title={task.assignee_name}
                                            >
                                                {task.assignee_name}
                                            </span>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-medium/60 italic">
                                            <User className="w-3.5 h-3.5 text-slate-medium/40 shrink-0" />
                                            <span className="text-[11px] font-medium">
                                                Unassigned
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-0.5 text-right shrink-0 pl-4">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-medium/60 select-none">
                                Due Date
                            </span>
                            {isTaskOverdue(task.due_date, task.status) ? (
                                <div className="flex items-center gap-1 text-[#D92D20]">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span className="text-xs font-bold uppercase tracking-wide">
                                        Overdue ({formatDueDate(task.due_date!)})
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs font-semibold text-slate-dark/95">
                                    {task.due_date ? formatDueDate(task.due_date) : "—"}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile View (under sm) */}
            <div className="sm:hidden block w-full space-y-3">
                {tasks.map((task) => {
                    const overdue = isTaskOverdue(task.due_date, task.status);

                    return (
                        <div
                            key={task.id}
                            className="w-full bg-white rounded-xl border border-[#DAE2FF] p-4 flex flex-col gap-3 shadow-xs hover:border-[#3B66F5]/40 transition-colors"
                        >
                            {/* Card Header: Title & Action Dot */}
                            <div className="flex justify-between items-start gap-3">
                                <h4 className="text-[15px] font-bold text-[#0F1E36] leading-snug">
                                    {task.title}
                                </h4>
                                <button className="text-[#737685]/50 hover:text-slate-dark p-0.5 rounded transition-colors shrink-0">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Card Footer: Assignee & Date/Status */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                                {/* Assignee */}
                                <div className="flex items-center gap-2 min-w-0">
                                    {task.assignee_name ? (
                                        <>
                                            {task.assignee_avatar ? (
                                                <img
                                                    src={task.assignee_avatar}
                                                    alt={task.assignee_name}
                                                    className="w-6 h-6 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-[#3B66F5] flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                                                    {getInitials(task.assignee_name)}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold text-[#5C6F84] truncate max-w-32">
                                                {task.assignee_name}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 rounded-md bg-[#EDF2FE] flex items-center justify-center text-[#3B66F5] shrink-0">
                                                <User className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-xs font-semibold text-[#5C6F84]">
                                                Unassigned
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Date Badge or Overdue Warning */}
                                <div className="shrink-0 flex items-center gap-1.5">
                                    {overdue ? (
                                        <div className="flex items-center gap-1 text-[#D92D20]">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                Overdue
                                            </span>
                                        </div>
                                    ) : task.due_date ? (
                                        <div className="flex items-center gap-1 text-[#5C6F84]">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                {formatDueDate(task.due_date)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-slate-medium/40">—</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Task Dashed Button at Bottom */}
                <button
                    onClick={() => navigate(`/project/${projectId}/tasks/new?epicId=${epicId}`)}
                    className="w-full py-3.5 bg-transparent border border-dashed border-[#DAE2FF] rounded-xl flex items-center justify-center gap-2 cursor-pointer text-[#5C6F84] hover:text-[#3B66F5] hover:border-[#3B66F5] hover:bg-[#EDF2FE]/30 transition-all duration-200"
                >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                        Add New Task
                    </span>
                </button>
            </div>
        </div>
    );
};

const TasksSkeleton = () => (
    <div className="w-full space-y-3">
        {/* Desktop Skeleton */}
        <div className="hidden sm:block w-full border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white shadow-xs animate-pulse">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-slate-100 shrink-0"></div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 bg-slate-100 rounded w-48"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                                <div className="h-3 bg-slate-100 rounded w-20"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="h-2.5 bg-slate-100 rounded w-12"></div>
                        <div className="h-3.5 bg-slate-100 rounded w-16"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="sm:hidden block w-full space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="w-full bg-white rounded-xl border border-[#DAE2FF] p-4 flex flex-col gap-4 shadow-sm"
                >
                    <div className="flex justify-between items-start">
                        <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                        <div className="w-4 h-4 bg-slate-100 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                            <div className="h-3 bg-slate-100 rounded w-16"></div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 bg-slate-100 rounded"></div>
                            <div className="h-3 bg-slate-100 rounded w-14"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
