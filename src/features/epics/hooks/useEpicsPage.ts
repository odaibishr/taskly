import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEpicsStore } from "@/features/epics";

export function useEpicsPage({ projectId }: { projectId?: string }) {
    const navigate = useNavigate();
    const { epics, isLoading, error, getEpicsByProjectId } = useEpicsStore();

    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            getEpicsByProjectId(projectId);
        }
    }, [projectId, getEpicsByProjectId]);

    const handleCreateRedirect = () => {
        if (projectId) {
            navigate(`/project/${projectId}/epics/new`);
        }
    };

    const handleOpenModal = (epicId: string) => {
        setSelectedEpicId(epicId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEpicId(null);
        setIsModalOpen(false);
    };

    return {
        epics,
        isLoading,
        error,
        getEpicsByProjectId,
        handleCreateRedirect,
        handleOpenModal,
        handleCloseModal,
        selectedEpicId,
        isModalOpen
    };
}