import { PlusCircle, SearchIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { EpicsList, EpicsSkeleton, EmptyEpics, EpicDetailsModal } from "@/features/epics";
import { useEpicsPage } from "@/features/epics";
import { TaskList } from "@/features/tasks";
import { useTasksStore } from "@/features/tasks";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";

/**
 * EpicTasksSlot — fetches and renders tasks for a specific epic inside
 * the EpicDetailsModal. Lives in EpicsPage (not inside the epics feature)
 * to prevent the epics <-> tasks circular dependency.
 */
const EpicTasksSlot = ({ projectId, epicId }: { projectId: string; epicId: string }) => {
    const { epicTasks, isEpicTasksLoading, epicTasksError, getEpicTasks, clearEpicTasks } =
        useTasksStore(
            useShallow((state) => ({
                epicTasks: state.epicTasks,
                isEpicTasksLoading: state.isEpicTasksLoading,
                epicTasksError: state.epicTasksError,
                getEpicTasks: state.getEpicTasks,
                clearEpicTasks: state.clearEpicTasks,
            })),
        );

    useEffect(() => {
        getEpicTasks(epicId);
        return () => {
            clearEpicTasks();
        };
    }, [epicId, getEpicTasks, clearEpicTasks]);

    return (
        <TaskList
            tasks={epicTasks}
            isLoading={isEpicTasksLoading}
            error={epicTasksError}
            projectId={projectId}
            epicId={epicId}
            onRetry={() => getEpicTasks(epicId)}
        />
    );
};

const EpicsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const {
        epics,
        isLoading,
        error,
        searchTerm,
        localSearchTerm,
        setLocalSearchTerm,
        currentPage,
        totalCount,
        limit,
        setCurrentPage,
        getEpicsByProjectId,
        handleCreateRedirect,
        handleOpenModal,
        handleCloseModal,
        selectedEpicId,
        isModalOpen,
    } = useEpicsPage({ projectId });

    if (error) {
        return (
            <main className="p-4">
                <ErrorCard retryAction={() => projectId && getEpicsByProjectId(projectId)} />
            </main>
        );
    }

    // Initial empty state when there are no epics at all in the project
    if (!isLoading && epics.length === 0 && !searchTerm) {
        return (
            <main>
                <HeaderSection
                    title="Epics"
                    description="Group tasks into themes to plan and organize work"
                    isBreadcrumbVisible={true}
                />
                <EmptyEpics onCreateEpic={handleCreateRedirect} isSearchActive={false} />
            </main>
        );
    }

    return (
        <main>
            <HeaderSection
                title="Epics"
                description="Group tasks into themes to plan and organize work"
                isBreadcrumbVisible={true}
            >
                <Button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleCreateRedirect}
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Epic
                </Button>
            </HeaderSection>

            {/* Floating Action Button for mobile users */}
            <div className="fixed bottom-4 right-4 md:hidden z-50">
                <Button
                    className="rounded-full bg-primary hover:bg-primary/95 w-14 h-14 p-0 flex items-center justify-center shadow-lg cursor-pointer"
                    onClick={handleCreateRedirect}
                >
                    <PlusCircle className="text-white" size={26} />
                </Button>
            </div>

            {/* Search Input Container */}
            <div className="mb-6 flex justify-start">
                <div className="flex w-full gap-2 text-slate-dark md:w-65 px-4 py-2.5 pr-4 text-dark-800 bg-surface-low rounded-sm outline-none ring-none border border-gray-100 focus-within:border-primary/50 transition-colors">
                    {isLoading ? (
                        <Loader2 size={24} className="text-slate-medium animate-spin" />
                    ) : (
                        <SearchIcon size={24} className="text-slate-medium" />
                    )}
                    <input
                        type="text"
                        placeholder="Search epics..."
                        className="w-full bg-transparent outline-none ring-none"
                        value={localSearchTerm}
                        onChange={(e) => setLocalSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading && epics.length === 0 ? (
                <EpicsSkeleton />
            ) : epics.length === 0 ? (
                <EmptyEpics
                    onCreateEpic={handleCreateRedirect}
                    isSearchActive={!!searchTerm}
                />
            ) : (
                <div
                    className={
                        isLoading
                            ? "opacity-60 transition-opacity duration-200 pointer-events-none"
                            : "transition-opacity duration-200"
                    }
                >
                    <EpicsList
                        epics={epics}
                        onCreateEpic={handleCreateRedirect}
                        onEpicClick={handleOpenModal}
                        currentPage={currentPage}
                        totalCount={totalCount}
                        limit={limit}
                        onPageChange={setCurrentPage}
                        isLoading={isLoading}
                    />
                </div>
            )}

            {projectId && selectedEpicId && (
                <EpicDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    projectId={projectId}
                    epicId={selectedEpicId}
                    tasksSlot={
                        <EpicTasksSlot projectId={projectId} epicId={selectedEpicId} />
                    }
                />
            )}
        </main>
    );
};

export default EpicsPage;
