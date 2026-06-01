import { TasksBoardView } from "@/features/tasks";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";
import { ListFilterIcon, LucideCircuitBoard, SearchIcon } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const TasksPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

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
                    {/* search */}
                    <div className="flex w-full gap-2 text-slate-dark md:w-65 px-4 py-2.5 pr-4 text-dark-800 bg-surface-low rounded-sm outline-none ring-none">
                        <SearchIcon size={24} className="text-slate-medium" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full outline-none ring-none"
                        />
                    </div>
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
                <TasksBoardView projectId={projectId} />
            ) : (
                <ErrorCard retryAction={() => {}} />
            )}
        </main>
    );
};

export default TasksPage;
