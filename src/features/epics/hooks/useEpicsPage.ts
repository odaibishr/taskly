import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

import { useEpicsStore } from "@/features/epics";
import { useDebouncedCallback } from "@/shared/hooks/useDebounce";

export function useEpicsPage({ projectId }: { projectId?: string }) {
    const navigate = useNavigate();
    const {
        epics,
        isLoading,
        error,
        getEpicsByProjectId,
        searchTerm,
        currentPage,
        totalCount,
        limit,
        setSearchTerm,
        setCurrentPage,
    } = useEpicsStore(
        useShallow((state) => ({
            epics: state.epics,
            isLoading: state.isLoading,
            error: state.error,
            getEpicsByProjectId: state.getEpicsByProjectId,
            searchTerm: state.searchTerm,
            currentPage: state.currentPage,
            totalCount: state.totalCount,
            limit: state.limit,
            setSearchTerm: state.setSearchTerm,
            setCurrentPage: state.setCurrentPage,
        }))
    );

    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Keep local search input synchronized if search term changes in store (e.g. project reset)
    const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
    if (searchTerm !== prevSearchTerm) {
        setLocalSearchTerm(searchTerm);
        setPrevSearchTerm(searchTerm);
    }

    const debouncedSetSearchTerm = useDebouncedCallback((val: string) => {
        setSearchTerm(val);
    }, 400);

    const handleSearchChange = (val: string) => {
        setLocalSearchTerm(val);
        debouncedSetSearchTerm(val);
    };

    const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            getEpicsByProjectId(projectId);
        }
    }, [projectId, getEpicsByProjectId, searchTerm, currentPage]);

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
        searchTerm,
        localSearchTerm,
        setLocalSearchTerm: handleSearchChange,
        currentPage,
        totalCount,
        limit,
        setCurrentPage,
        getEpicsByProjectId,
        handleCreateRedirect,
        handleOpenModal,
        handleCloseModal,
        selectedEpicId,
        isModalOpen
    };
}