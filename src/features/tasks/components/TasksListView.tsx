import { User, Loader2, RefreshCw, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { useTasksList } from "../hooks/useTasksList";

import type { ProjectTask, TaskStatus } from "@/features/tasks/types";
import { cn, getInitials, getAvatarColors, formatDueDate } from "@/shared/lib/utils";


interface TasksListViewProps {
    projectId: string;
}

const statusBadges: Record<TaskStatus, { text: string; bg: string; textClass: string }> = {
    TO_DO: { text: "TO DO", bg: "bg-[#F1F3FF]", textClass: "text-[#4F5F7B]" },
    IN_PROGRESS: { text: "IN PROGRESS", bg: "bg-[#E0ECFF]", textClass: "text-[#0052CC]" },
    BLOCKED: { text: "URGENT", bg: "bg-[#FEE4E2]", textClass: "text-[#D92D20]" },
    IN_REVIEW: { text: "IN REVIEW", bg: "bg-[#FEF0C7]", textClass: "text-[#B54708]" },
    READY_FOR_QA: { text: "READY FOR QA", bg: "bg-[#EFF8FF]", textClass: "text-[#1570EF]" },
    REOPENED: { text: "REOPENED", bg: "bg-[#FDF2FA]", textClass: "text-[#C11574]" },
    READY_FOR_PRODUCTION: { text: "READY PROD", bg: "bg-[#ECFDF3]", textClass: "text-[#027A48]" },
    DONE: { text: "COMPLETED", bg: "bg-[#ECFDF3]", textClass: "text-[#027A48]" },
};

const TasksListView: React.FC<TasksListViewProps> = ({ projectId }) => {
    const {
        tasks,
        currentTasks,
        isLoading,
        error,
        currentPage,
        totalPages,
        retry,
        goToNextPage,
        goToPrevPage,
    } = useTasksList(projectId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-xl border border-gray-100/80 shadow-3xs">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-slate-medium/80">
                    Loading project pipeline...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50/50 border border-red-100 rounded-xl text-center space-y-3 shadow-3xs">
                <p className="text-sm font-semibold text-red-600">
                    Failed to load the pipeline tasks
                </p>
                <button
                    onClick={retry}
                    className="flex items-center gap-1.5 mx-auto text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                    <RefreshCw size={12} /> Retry
                </button>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl p-8 shadow-3xs">
                <p className="text-slate-medium font-semibold">
                    No tasks available in this project.
                </p>
                <p className="text-xs text-slate-medium/60 mt-1">
                    Create epics and tasks to begin monitoring pipeline.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl border border-[#F2F4F7] shadow-3xs overflow-hidden flex flex-col justify-between min-h-125">
            <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#F2F4F7] bg-[#F9FAFB]/50">
                            <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 w-[15%]">
                                Task ID
                            </th>
                            <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 w-[35%]">
                                Title
                            </th>
                            <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 w-[15%]">
                                Status
                            </th>
                            <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 w-[15%]">
                                Due Date
                            </th>
                            <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 w-[20%]">
                                Assignee
                            </th>
                            <th className="py-4 px-6 w-[5%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2F4F7]">
                        {currentTasks.map((task) => (
                            <TaskRow key={task.id} task={task} projectId={projectId} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between py-4 px-6 border-t border-[#F2F4F7]">
                <div className="text-[13px] font-semibold text-slate-medium/70 select-none">
                    Showing {currentTasks.length} of {tasks.length} tasks
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={cn(
                            "w-8 h-8 rounded-lg border border-[#EAECF0] bg-white flex items-center justify-center text-slate-medium hover:text-slate-dark hover:bg-slate-50 cursor-pointer transition-all active:scale-95",
                            currentPage === 1 &&
                                "opacity-50 cursor-not-allowed pointer-events-none",
                        )}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-[13px] font-bold text-slate-dark select-none">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={cn(
                            "w-8 h-8 rounded-lg border border-[#EAECF0] bg-white flex items-center justify-center text-slate-medium hover:text-slate-dark hover:bg-slate-50 cursor-pointer transition-all active:scale-95",
                            currentPage === totalPages &&
                                "opacity-50 cursor-not-allowed pointer-events-none",
                        )}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* Sub-component for individual Task Row */
interface TaskRowProps {
    task: ProjectTask;
    projectId: string;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, projectId }) => {
    const badge = statusBadges[task.status] || {
        text: task.status,
        bg: "bg-slate-100",
        textClass: "text-slate-medium",
    };
    const avColors = task.assignee_name ? getAvatarColors(task.assignee_name) : null;
    const formattedDate = formatDueDate(task.due_date);

    return (
        <tr className="hover:bg-slate-50/20 transition-all duration-200">
            {/* Task ID */}
            <td className="py-4.5 px-6 whitespace-nowrap">
                <Link
                    to={`/project/${projectId}/tasks/new?status=${task.status}&from=board`}
                    className="text-sm font-semibold text-[#0052CC] hover:underline"
                >
                    TASK-{task.id.substring(0, 8).toUpperCase()}
                </Link>
            </td>
            {/* Title */}
            <td className="py-4.5 px-6">
                <span className="text-[13.5px] font-bold text-[#041B3C] leading-snug line-clamp-2">
                    {task.title}
                </span>
            </td>
            {/* Status */}
            <td className="py-4.5 px-6 whitespace-nowrap">
                <span
                    className={cn(
                        "inline-flex items-center justify-center text-[10px] font-bold tracking-wider rounded-md px-2.5 py-1 select-none",
                        badge.bg,
                        badge.textClass,
                    )}
                >
                    {badge.text}
                </span>
            </td>
            {/* Due Date */}
            <td className="py-4.5 px-6 whitespace-nowrap text-sm font-medium text-slate-medium/80">
                {formattedDate}
            </td>
            {/* Assignee */}
            <td className="py-4.5 px-6 whitespace-nowrap">
                <div className="flex items-center gap-2.5">
                    {task.assignee_name ? (
                        <>
                            {task.assignee_avatar ? (
                                <img
                                    src={task.assignee_avatar}
                                    alt={task.assignee_name}
                                    className="w-5.5 h-5.5 rounded-full object-cover border border-slate-100 shrink-0"
                                />
                            ) : (
                                <div
                                    className={cn(
                                        "w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold border shrink-0 select-none",
                                        avColors?.bg,
                                        avColors?.border,
                                    )}
                                >
                                    {getInitials(task.assignee_name)}
                                </div>
                            )}
                            <span className="text-[13px] font-semibold text-slate-medium/90 truncate max-w-32">
                                {task.assignee_name}
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-medium/40 italic">
                            <div className="w-5.5 h-5.5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                <User className="w-3 h-3" />
                            </div>
                            <span className="text-[12px] font-medium">Unassigned</span>
                        </div>
                    )}
                </div>
            </td>
            {/* Action button */}
            <td className="py-4.5 px-6 text-right whitespace-nowrap">
                <button className="text-slate-medium/40 hover:text-slate-dark cursor-pointer transition-colors p-1 rounded">
                    <MoreHorizontal size={18} />
                </button>
            </td>
        </tr>
    );
};

export default TasksListView;
