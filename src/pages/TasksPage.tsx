import { ListFilterIcon, LucideCircuitBoard } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { TaskDetailsModal, TasksBoardView, TasksListView } from "@/features/tasks";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";

const TasksPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");

    const handleOpenModal = (taskId: string) => {
        setSelectedTaskId(taskId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const view = searchParams.get("view") || "board";

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams({ view: e.target.value });
    };

    return (
        <main className="w-full">
            <section className="flex flex-col md:flex-row justify-between md:items-center max-sm:mb-5">
                <HeaderSection
                    title="Active Workboard"
                    description="Curating Project Alpha's production pipeline and milestones."
                    isBreadcrumbVisible={true}
                />
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    {/* view */}
                    <div className="hidden md:flex items-center justify-center cursor-pointer bg-background shadow-sm border border-slate-light rounded-sm py-2 px-4 gap-3">
                        <LucideCircuitBoard size={24} />
                        <select
                            value={view}
                            onChange={handleViewChange}
                            className="text-dark-800 outline-none ring-none w-full h-full"
                        >
                            <option value="board">Board</option>
                            <option value="list">List</option>
                        </select>
                    </div>
                    {/* add task */}
                    <button className="rounded-sm hidden md:flex items-center justify-center bg-surface-highest p-2 cursor-pointer">
                        <ListFilterIcon size={24} />
                    </button>
                    <Button
                        variant="primary"
                        className="cursor-pointer md:hidden"
                        onClick={() => console.log("add task")}
                    >
                        Add Task
                    </Button>
                </div>
            </section>
            {projectId ? (
                view === "list" ? (
                    <TasksListView projectId={projectId} onTaskClick={handleOpenModal}/>
                ) : (
                    <TasksBoardView projectId={projectId} onTaskClick={handleOpenModal}/>
                )
            ) : (
                <ErrorCard retryAction={() => {}} />
            )}

            {projectId && isModalOpen && (
                <TaskDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    projectId={projectId}
                    taskId={selectedTaskId}
                />
            )}
        </main>
    );
};

export default TasksPage;
