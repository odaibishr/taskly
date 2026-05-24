import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useEpicsStore } from "@/features/epics";

export function useEpicsPage({ projectId }: { projectId?: string }) {
    const navigate = useNavigate();
    const { epics, isLoading, error, getEpicsByProjectId } = useEpicsStore();

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

    return { epics, isLoading, error, getEpicsByProjectId, handleCreateRedirect };
}