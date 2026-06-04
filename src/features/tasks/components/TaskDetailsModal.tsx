import { useTasksStore } from "../store/tasks.store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "@/shared/components/Button";
import RightTaskModalContent from "./RightTaskModalContent";

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId?: string;
}

const TaskDetailsModal = ({ isOpen, onClose, projectId, taskId }: TaskDetailsModalProps) => {
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
            setSelectedTaskId("");
        };
    }, [isOpen, taskId, getSelectedTaskDetails, setSelectedTaskId]);

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

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (isSelectedTaskLoading) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
                onClick={handleBackdropClick}
                id="task-details-modal-overlay"
            >
                <div className="relative w-full max-w-lg p-8 flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="mt-4 text-sm font-semibold text-slate-medium">
                        Loading task details...
                    </span>
                </div>
            </div>
        );
    }

    if (selectedTaskError) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
                onClick={handleBackdropClick}
                id="task-details-modal-overlay"
            >
                <div className="relative w-full max-w-lg p-8 flex flex-col items-center justify-center bg-white rounded-lg shadow-2xl space-y-4">
                    <h3 className="text-lg font-bold text-red-600">Error Loading Task</h3>
                    <p className="text-sm text-slate-medium text-center">{selectedTaskError}</p>
                    <Button variant="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    if (!selectedTask) return null;

    return (
        <div
            className="fixed inset-0  z-50 flex items-center justify-center p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={handleBackdropClick}
            id="task-details-modal-overlay"
        >
            <div className="relative w-full max-w-4xl min-h-[90vh] flex flex-col bg-white rounded-lg shadow-2xl overflow-y-auto transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-8">
                <div className="flex-1 flex items-stretch justify-between">
                    <RightTaskModalContent
                        id={selectedTask.id}
                        title={selectedTask.title}
                        description={selectedTask.description}
                        onClose={onClose}
                    />

                    <div className="bg-surface-highest w-[25%]">
                        <button
                            className="inline-flex items-center justify-center rounded-sm bg-error-base hover:bg-error-dark text-surface-on-highest transition-colors"
                            onClick={onClose}
                            type="button"
                            data-testid="task-details-modal-close-btn"
                        >
                            <X />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
