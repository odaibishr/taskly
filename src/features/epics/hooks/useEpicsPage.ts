import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useEpicsStore } from "@/features/epics";

export function useEpicsPage() {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
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

    return { epics, isLoading, error, handleCreateRedirect };
}