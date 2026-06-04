import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useTasksStore } from "@/features/tasks/store/tasks.store";

interface UseTaskDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId?: string;
}

export function useTaskDetails({ isOpen, onClose, projectId, taskId }: UseTaskDetailsProps) {
    const {
        selectedTask,
        isSelectedTaskLoading,
        selectedTaskError,
        getSelectedTaskDetails,
        setSelectedTaskId,
    } = useTasksStore(
        useShallow((state) => ({
            selectedTask: state.selectedTask,
            isSelectedTaskLoading: state.isSelectedTaskLoading,
            selectedTaskError: state.selectedTaskError,
            getSelectedTaskDetails: state.getSelectedTaskDetails,
            setSelectedTaskId: state.setSelectedTaskId,
        })),
    );

    useEffect(() => {
        if (isOpen && taskId) {
            getSelectedTaskDetails(projectId, taskId);
        }
        return () => {
            setSelectedTaskId(null);
        };
    }, [isOpen, taskId, projectId, getSelectedTaskDetails, setSelectedTaskId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return {
        selectedTask,
        isLoading: isSelectedTaskLoading,
        error: selectedTaskError,
        handleBackdropClick,
    };
}
