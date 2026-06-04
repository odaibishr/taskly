import { Plus, Loader2, RefreshCw } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import TaskBoardCard from "./TaskBoardCard";

import { TASK_STATUSES } from "@/features/tasks/constants";
import { useTasksStore } from "@/features/tasks/store/tasks.store";
import type { ProjectTask } from "@/features/tasks/types";
import { cn } from "@/shared/lib/utils";

interface TasksBoardViewProps {
    projectId: string;
    onTaskClick: (taskId: string) => void;
}

const COLUMNS = TASK_STATUSES;

const TasksBoardView: React.FC<TasksBoardViewProps> = ({ projectId, onTaskClick }) => {
    const {
        projectTasks,
        totalTasks,
        isLoading,
        error,
        getProjectTasks,
        clearProjectTasks,
    } = useTasksStore(
        useShallow((state) => ({
            projectTasks: state.projectTasks,
            totalTasks: state.totalTasks,
            isLoading: state.isProjectTasksLoading,
            error: state.projectTasksError,
            getProjectTasks: state.getProjectTasks,
            clearProjectTasks: state.clearProjectTasks,
        }))
    );

    const limit = 15;

    const loadMoreTasks = React.useCallback(() => {
        if (isLoading) return;
        if (projectTasks.length >= totalTasks) return;

        const nextPage = Math.ceil(projectTasks.length / limit) + 1;
        const offset = (nextPage - 1) * limit;
        getProjectTasks(projectId, limit, offset, true);
    }, [isLoading, projectTasks.length, totalTasks, projectId, getProjectTasks]);

    // Handle mobile responsiveness and scroll to bottom of page
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        const handleWindowScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                loadMoreTasks();
            }
        };

        window.addEventListener("scroll", handleWindowScroll);
        return () => {
            window.removeEventListener("scroll", handleWindowScroll);
        };
    }, [isMobile, loadMoreTasks]);

    useEffect(() => {
        if (projectId) {
            getProjectTasks(projectId, limit, 0, false);
        }
        return () => {
            clearProjectTasks();
        };
    }, [projectId, getProjectTasks, clearProjectTasks]);

    if (isLoading && projectTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm font-semibold text-slate-medium/80">
                    Loading workboard...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50/50 border border-red-100 rounded-xl text-center space-y-3">
                <p className="text-sm font-semibold text-red-600">Failed to load board tasks</p>
                <button
                    onClick={() => getProjectTasks(projectId, limit, 0, false)}
                    className="flex items-center gap-1.5 mx-auto text-xs font-bold text-primary hover:underline cursor-pointer"
                >
                    <RefreshCw size={12} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6">
            {COLUMNS.map((column) => {
                const columnTasks = projectTasks.filter((t) => t.status === column.status);
                return (
                    <div key={column.status} className="snap-start shrink-0 w-85 flex flex-col">
                        <TaskColumn
                            projectId={projectId}
                            column={column}
                            tasks={columnTasks}
                            onTaskClick={onTaskClick}
                            onScrollNearBottom={loadMoreTasks}
                            isLoadingMore={isLoading && projectTasks.length > 0}
                        />
                    </div>
                );
            })}
        </div>
    );
};

interface TaskColumnProps {
    projectId: string;
    column: (typeof COLUMNS)[number];
    tasks: ProjectTask[];
    onTaskClick: (taskId: string) => void;
    onScrollNearBottom: () => void;
    isLoadingMore: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ 
    projectId, 
    column, 
    tasks, 
    onTaskClick,
    onScrollNearBottom,
    isLoadingMore,
}) => {
    const navigate = useNavigate();

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
                        {tasks.length}
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

            <div 
                onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
                        onScrollNearBottom();
                    }
                }}
                className="flex-1 space-y-4 overflow-y-auto max-h-137.5 pr-1 scrollbar-thin"
            >
                {tasks.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-slate-100 rounded-xl">
                        <span className="text-[11px] text-slate-medium/40 font-medium">
                            No tasks in this status
                        </span>
                    </div>
                ) : (
                    tasks.map((task) => <TaskBoardCard key={task.id} task={task} onTaskClick={onTaskClick} />)
                )}
                {isLoadingMore && (
                    <div className="flex justify-center py-2">
                        <Loader2 className="w-5.5 h-5.5 text-primary animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksBoardView;
