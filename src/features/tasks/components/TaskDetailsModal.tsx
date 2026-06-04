import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import LeftTaskkModalContent from "@/features/tasks/components/LeftTaskModalContent";
import MobileTaskModalContent from "@/features/tasks/components/MobileTaskModalContent";
import RightTaskModalContent from "@/features/tasks/components/RightTaskModalContent";
import { useTasksStore } from "@/features/tasks/store/tasks.store";
import Button from "@/shared/components/Button";

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
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={handleBackdropClick}
            id="task-details-modal-overlay"
        >
            <div className="relative w-full max-h-[85vh] md:min-h-[90vh] md:max-w-4xl flex flex-col bg-[#F3F4F8] md:bg-white rounded-t-4xl md:rounded-lg shadow-2xl overflow-y-auto transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-full">
                {/* Desktop layout */}
                <div className="hidden md:flex flex-1 items-stretch justify-between">
                    <RightTaskModalContent
                        id={selectedTask.id}
                        title={selectedTask.title}
                        description={selectedTask.description ?? undefined}
                        onClose={onClose}
                    />

                    <LeftTaskkModalContent
                        status={selectedTask.status}
                        assignee_name={selectedTask.assignee_name ?? undefined}
                        reporter_name={selectedTask.reporter_name ?? undefined}
                        created_at={selectedTask.created_at ?? undefined}
                        due_date={selectedTask.due_date ?? undefined}
                    />
                </div>

                {/* Mobile layout (Bottom Sheet) */}
                <MobileTaskModalContent task={selectedTask} onClose={onClose} />
            </div>
        </div>
    );
};

export default TaskDetailsModal;
