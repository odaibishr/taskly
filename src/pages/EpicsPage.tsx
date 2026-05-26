import { useParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { EpicsList, EpicsSkeleton, EmptyEpics, EpicDetailsModal } from "@/features/epics";
import { HeaderSection } from "@/shared/components/HeaderSection";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { useEpicsPage } from "@/features/epics";

const EpicsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const {
        epics,
        isLoading,
        error,
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

    if (isLoading && epics.length === 0) {
        return (
            <main>
                <HeaderSection
                    title="Epics"
                    description="Group tasks into themes to plan and organize work"
                    isBreadcrumbVisible={true}
                >
                    <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse" />
                </HeaderSection>
                <EpicsSkeleton />
            </main>
        );
    }

    if (!isLoading && epics.length === 0) {
        return (
            <main>
                <HeaderSection
                    title="Epics"
                    description="Group tasks into themes to plan and organize work"
                    isBreadcrumbVisible={true}
                />
                <EmptyEpics onCreateEpic={handleCreateRedirect} />
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

            <EpicsList
                epics={epics}
                onCreateEpic={handleCreateRedirect}
                onEpicClick={handleOpenModal}
            />

            <EpicsList
                epics={epics}
                onCreateEpic={handleCreateRedirect}
                onEpicClick={handleOpenModal}
            />
            {projectId && selectedEpicId && (
                <EpicDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    projectId={projectId}
                    epicId={selectedEpicId}
                />
            )}
        </main>
    );
};

export default EpicsPage;
