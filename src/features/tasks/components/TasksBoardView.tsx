import { Plus, Loader2, RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TaskBoardCard from "./TaskBoardCard";

import { fetchTasksByStatus } from "@/features/tasks/api/tasks.api";
import type { ProjectTask, TaskStatus } from "@/features/tasks/types";
import { cn } from "@/shared/lib/utils";

interface TasksBoardViewProps {
    projectId: string;
    onTaskClick: (taskId: string) => void;
}

const COLUMNS: { status: TaskStatus; label: string; dotColor: string }[] = [
    { status: "TO_DO", label: "TO DO", dotColor: "bg-[#3B66F5]" },
    { status: "IN_PROGRESS", label: "IN PROGRESS", dotColor: "bg-[#0052CC]" },
    { status: "BLOCKED", label: "BLOCKED", dotColor: "bg-[#D92D20]" },
    { status: "IN_REVIEW", label: "IN REVIEW", dotColor: "bg-[#B54708]" },
    { status: "READY_FOR_QA", label: "READY FOR QA", dotColor: "bg-[#1570EF]" },
    { status: "REOPENED", label: "REOPENED", dotColor: "bg-[#C11574]" },
    { status: "READY_FOR_PRODUCTION", label: "READY FOR PRODUCTION", dotColor: "bg-[#027A48]" },
    { status: "DONE", label: "DONE", dotColor: "bg-[#027A48]" },
];

const TasksBoardView: React.FC<TasksBoardViewProps> = ({ projectId, onTaskClick }) => {
    return (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6">
            {COLUMNS.map((column) => (
                <div key={column.status} className="snap-start shrink-0 w-85 flex flex-col">
                    <TaskColumn projectId={projectId} column={column} onTaskClick={onTaskClick} />
                </div>
            ))}
        </div>
    );
};

interface TaskColumnProps {
    projectId: string;
    column: (typeof COLUMNS)[number];
    onTaskClick: (taskId: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ projectId, column, onTaskClick }) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchTasksByStatus(projectId, column.status);
            setTasks(data);
        } catch {
            setError("Failed to fetch");
        } finally {
            setIsLoading(false);
        }
    }, [projectId, column.status]);

    useEffect(() => {
        Promise.resolve().then(() => {
            loadTasks();
        });
    }, [loadTasks]);

    const handleAddTask = () => {
        navigate(`/project/${projectId}/tasks/new?status=${column.status}&from=board`);
    };

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]/40 rounded-2xl p-4 border border-[#F2F4F7] shadow-3xs min-h-137.5">
            <div className="flex justify-between items-center mb-4 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", column.dotColor)} />
                    <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-medium truncate">
                        {column.label}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#EFF1F5] text-slate-medium text-[10px] font-bold rounded-md">
                        {isLoading ? "..." : tasks.length}
                    </span>
                </div>

                <button
                    onClick={handleAddTask}
                    className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-medium/70 hover:text-slate-dark cursor-pointer transition-all duration-200"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="mb-4">
                <button
                    onClick={handleAddTask}
                    className="w-full py-3.5 bg-[#F9FAFB]/50 hover:bg-[#F2F4F7]/40 border border-dashed border-[#EAECF0] hover:border-primary/40 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 group shadow-3xs"
                >
                    <div className="w-5 h-5 rounded-full border border-slate-medium/20 group-hover:border-primary/40 flex items-center justify-center text-slate-medium/60 group-hover:text-primary transition-colors shrink-0">
                        <Plus size={11} strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-medium/80 group-hover:text-primary transition-colors">
                        Add New Task
                    </span>
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-137.5 pr-1 scrollbar-thin">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-2">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-[11px] font-semibold text-slate-medium/60">
                            Loading tasks...
                        </span>
                    </div>
                ) : error ? (
                    <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-center space-y-2">
                        <p className="text-[11px] font-semibold text-red-600">Failed to load</p>
                        <button
                            onClick={loadTasks}
                            className="flex items-center gap-1 mx-auto text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        >
                            <RefreshCw size={10} /> Retry
                        </button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-100 rounded-xl">
                        <span className="text-[11px] text-slate-medium/40 font-medium">
                            No tasks in this status
                        </span>
                    </div>
                ) : (
                    tasks.map((task) => <TaskBoardCard key={task.id} task={task} onTaskClick={onTaskClick} />)
                )}
            </div>
        </div>
    );
};

export default TasksBoardView;
