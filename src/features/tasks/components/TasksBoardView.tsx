import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, Loader2, RefreshCw, SearchIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import TaskBoardCard from "./TaskBoardCard";

import { TASK_STATUSES } from "@/features/tasks/constants";
import { useTasksStore } from "@/features/tasks/store/tasks.store";
import type { ProjectTask, TaskStatus } from "@/features/tasks/types";
import { useDebounce } from "@/shared/hooks/useDebounce";
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
        updateTaskStatus,
    } = useTasksStore(
        useShallow((state) => ({
            projectTasks: state.projectTasks,
            totalTasks: state.totalTasks,
            isLoading: state.isProjectTasksLoading,
            error: state.projectTasksError,
            getProjectTasks: state.getProjectTasks,
            clearProjectTasks: state.clearProjectTasks,
            updateTaskStatus: state.updateTaskStatus,
        })),
    );

    const [toast, setToast] = React.useState<{ message: string; type: "error" | "success" } | null>(
        null,
    );

    const [localSearchTerm, setLocalSearchTerm] = React.useState("");
    const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

    const limit = 15;

    const loadMoreTasks = React.useCallback(() => {
        if (isLoading) return;
        if (projectTasks.length >= totalTasks) return;

        const nextPage = Math.ceil(projectTasks.length / limit) + 1;
        const offset = (nextPage - 1) * limit;
        getProjectTasks(projectId, limit, offset, true, debouncedSearchTerm);
    }, [isLoading, projectTasks.length, totalTasks, projectId, getProjectTasks, debouncedSearchTerm]);

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
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 100
            ) {
                loadMoreTasks();
            }
        };

        window.addEventListener("scroll", handleWindowScroll);
        return () => {
            window.removeEventListener("scroll", handleWindowScroll);
        };
    }, [isMobile, loadMoreTasks]);

    // Fetch tasks on project or search term change
    useEffect(() => {
        if (projectId) {
            getProjectTasks(projectId, limit, 0, false, debouncedSearchTerm);
        }
    }, [projectId, debouncedSearchTerm, getProjectTasks]);

    // Clean up store on unmount
    useEffect(() => {
        return () => {
            clearProjectTasks();
        };
    }, [clearProjectTasks]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => {
            setToast(null);
        }, 4000);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;

        try {
            await updateTaskStatus(draggableId, newStatus);
        } catch (err) {
            console.error("Failed to update task status:", err);
            setToast({
                message: "Failed to update task status. Reverting changes...",
                type: "error",
            });
        }
    };

    // Initial empty state when there are no tasks at all in the project (no search term)
    const isProjectEmpty = !isLoading && totalTasks === 0 && !debouncedSearchTerm;

    if (isProjectEmpty) {
        return (
            <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl p-8 shadow-3xs">
                <p className="text-slate-medium font-semibold">
                    No tasks found for this project
                </p>
                <p className="text-xs text-slate-medium/60 mt-1">
                    Create epics and tasks to begin monitoring pipeline.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full">
            {/* Search Input Container */}
            <div className="flex justify-start">
                <div className="flex w-full gap-2 text-slate-dark md:w-65 px-4 py-2.5 pr-4 text-dark-800 bg-surface-low rounded-sm outline-none ring-none border border-gray-100 focus-within:border-primary/50 transition-colors">
                    {isLoading && projectTasks.length === 0 ? (
                        <Loader2 size={24} className="text-slate-medium animate-spin" />
                    ) : (
                        <SearchIcon size={24} className="text-slate-medium" />
                    )}
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full bg-transparent outline-none ring-none"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading && projectTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-sm font-semibold text-slate-medium/80">
                        Loading workboard...
                    </span>
                </div>
            ) : error && projectTasks.length === 0 ? (
                <div className="p-8 bg-red-50/50 border border-red-100 rounded-xl text-center space-y-3">
                    <p className="text-sm font-semibold text-red-600">
                        Failed to search tasks
                    </p>
                    <button
                        onClick={() => getProjectTasks(projectId, limit, 0, false, debouncedSearchTerm)}
                        className="flex items-center gap-1.5 mx-auto text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                        <RefreshCw size={12} /> Retry
                    </button>
                </div>
            ) : totalTasks === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl p-8 shadow-3xs">
                    <p className="text-slate-medium font-semibold">
                        No tasks found matching your search
                    </p>
                </div>
            ) : (
                <>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x scroll-smooth -mx-4 px-4 sm:-mx-6 sm:px-6">
                            {COLUMNS.map((column) => {
                                const columnTasks = projectTasks.filter((t) => t.status === column.status);
                                return (
                                    <div
                                        key={column.status}
                                        className="snap-start shrink-0 w-85 flex flex-col"
                                    >
                                        <TaskColumn
                                            projectId={projectId}
                                            column={column}
                                            tasks={columnTasks}
                                            onTaskClick={onTaskClick}
                                            onScrollNearBottom={loadMoreTasks}
                                            isLoadingMore={isLoading && projectTasks.length > 0}
                                            hasError={!!error}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </DragDropContext>

                    {/* Custom premium toast display */}
                    {toast && (
                        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#FEE4E2] dark:bg-slate-900 dark:border-red-950/50 shadow-lg rounded-2xl p-4 pr-5 max-w-sm animate-toast-slide-in">
                            <div className="w-8 h-8 rounded-full bg-[#FEF3F2] flex items-center justify-center text-red-600 shrink-0">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-dark">Update Failed</h4>
                                <p className="text-[11px] text-slate-medium mt-0.5 leading-snug">
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setToast(null)}
                                className="text-slate-medium/50 hover:text-slate-dark cursor-pointer text-xs font-semibold p-1"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <style>{`
                        @keyframes toast-slide-in {
                            0% { transform: translateY(1rem); opacity: 0; }
                            100% { transform: translateY(0); opacity: 1; }
                        }
                        .animate-toast-slide-in {
                            animation: toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        }
                    `}</style>
                </>
            )}
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
    hasError: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
    projectId,
    column,
    tasks,
    onTaskClick,
    onScrollNearBottom,
    isLoadingMore,
    hasError,
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

            <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        onScroll={(e) => {
                            const target = e.currentTarget;
                            if (target.scrollHeight - target.scrollTop - target.clientHeight < 50) {
                                onScrollNearBottom();
                            }
                        }}
                        className={cn(
                            "flex-1 space-y-4 overflow-y-auto max-h-137.5 pr-1 scrollbar-thin transition-all duration-250 min-h-37.5",
                            snapshot.isDraggingOver ? "bg-[#EFF1F5]/30 rounded-xl px-1" : "",
                        )}
                    >
                        {tasks.length === 0 ? (
                            <div className="py-8 text-center border border-dashed border-[#EAECF0] rounded-xl bg-white/20">
                                <span className="text-[11px] text-slate-medium/40 font-medium">
                                    No tasks in this status
                                </span>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(providedDrag, snapshotDrag) => (
                                        <div
                                            ref={providedDrag.innerRef}
                                            {...providedDrag.draggableProps}
                                            {...providedDrag.dragHandleProps}
                                            className={cn(
                                                "select-none transition-all duration-100",
                                                snapshotDrag.isDragging
                                                    ? "opacity-90 scale-[1.02] rotate-1 shadow-md z-50"
                                                    : "",
                                            )}
                                        >
                                            <TaskBoardCard task={task} onTaskClick={onTaskClick} />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                        {isLoadingMore && (
                            <div className="flex justify-center py-2">
                                <Loader2 className="w-5.5 h-5.5 text-primary animate-spin" />
                            </div>
                        )}
                        {hasError && (
                            <div className="flex flex-col items-center gap-1.5 py-2 text-center">
                                <span className="text-[11px] text-red-500 font-semibold">
                                    Failed to load more tasks
                                </span>
                                <button
                                    onClick={onScrollNearBottom}
                                    className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                                >
                                    <RefreshCw size={10} /> Retry
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default TasksBoardView;
