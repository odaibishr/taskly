import React, { useEffect } from "react";
import { X, Calendar, User, Plus, Loader2, List } from "lucide-react";
import { useEpicsStore } from "@/features/epics/store/epics.store";
import { getInitials } from "@/shared/lib/utils";
import EpicDetail from "@/assets/EpicDetail.svg";
import Button from "@/shared/components/Button";

interface EpicDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    epicId: string;
}

export const EpicDetailsModal: React.FC<EpicDetailsModalProps> = ({
    isOpen,
    onClose,
    projectId,
    epicId,
}) => {
    const {
        selectedEpic,
        isSelectedEpicLoading,
        selectedEpicError,
        getEpicDetails,
        setSelectedEpic,
    } = useEpicsStore();

    useEffect(() => {
        if (isOpen && projectId && epicId) {
            getEpicDetails(projectId, epicId);
        }
        return () => {
            setSelectedEpic(null);
        };
    }, [isOpen, projectId, epicId, getEpicDetails, setSelectedEpic]);

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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={handleBackdropClick}
            id="epic-details-modal-overlay"
        >
            <div
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(4,27,60,0.16)] border border-gray-100 overflow-hidden transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-8 flex flex-col max-h-[90vh]"
                role="dialog"
                aria-modal="true"
                id="epic-details-modal-container"
            >
                {isSelectedEpicLoading && (
                    <div className="flex flex-col items-center justify-center py-20 px-6 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-slate-medium text-sm font-semibold">
                            Loading Epic details...
                        </p>
                    </div>
                )}

                {!isSelectedEpicLoading && selectedEpicError && (
                    <div className="p-8 text-center space-y-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <X className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-dark">Failed to load Epic</h3>
                        <p className="text-slate-medium text-sm max-w-md mx-auto">
                            {selectedEpicError}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white text-sm font-bold rounded-lg transition-all cursor-pointer"
                        >
                            Close Modal
                        </button>
                    </div>
                )}

                {!isSelectedEpicLoading && !selectedEpicError && selectedEpic && (
                    <>
                        {/* الجزء العلوي (Header) */}
                        <div className="flex items-start justify-between p-6">
                            <div className="space-y-1.5 pr-8">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                    <img src={EpicDetail} alt="EpicDetail" />
                                    {selectedEpic.epic_id || "Epic"}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-dark leading-snug">
                                    {selectedEpic.title}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-medium hover:bg-slate-low hover:text-slate-dark transition-all cursor-pointer"
                                aria-label="Close modal"
                                id="close-epic-modal-btn"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <div className="space-y-2">
                                <div>
                                    {selectedEpic.description ? (
                                        <p className="text-slate-dark text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedEpic.description}
                                        </p>
                                    ) : (
                                        <p className="text-slate-medium italic text-sm">
                                            No description provided
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                        Created By
                                    </h4>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                            {getInitials(selectedEpic.created_by.name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p
                                                className="text-slate-dark text-sm font-medium truncate"
                                                title={selectedEpic.created_by.name}
                                            >
                                                {selectedEpic.created_by.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                        Assignee
                                    </h4>
                                    {selectedEpic.assignee ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-[#DAE2FF] text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                {getInitials(selectedEpic.assignee.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <p
                                                    className="text-slate-dark text-sm font-medium truncate"
                                                    title={selectedEpic.assignee.name}
                                                >
                                                    {selectedEpic.assignee.name}
                                                </p>
                                                <p className="text-[10px] text-slate-medium truncate">
                                                    {selectedEpic.assignee.department || "Member"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5 text-slate-medium italic">
                                            <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center shrink-0 bg-slate-low/50">
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="text-sm font-medium">Unassigned</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text[10px] font-medium text-slate-medium">
                                        Deadline
                                    </h4>
                                    <div className="flex items-center gap-2.5 text-slate-dark">
                                        <div className="w-8 h-8 rounded-full bg-slate-low flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-medium" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {formatDate(selectedEpic.deadline)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                        Created At
                                    </h4>
                                    <div className="flex items-center gap-2.5 text-slate-dark">
                                        <div className="w-8 h-8 rounded-full bg-slate-low flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-medium" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {formatDate(selectedEpic.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-dark">Tasks</h3>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-0.5 text-primary"
                                    >
                                        <Plus size={18} />
                                        <span className="text-sm font-semibold">Add Task</span>
                                    </Button>
                                </div>

                                <div className="flex flex-col items-center justify-center py-10 px-4 bg-[#F1F3FF] rounded-lg text-center space-y-7 animate-in fade-in duration-500">
                                    <div className="w-12 h-12 bg-[#D7E2FF] rounded-lg flex items-center justify-center shadow-sm">
                                        <List className="w-6 h-6 text-slate-medium" />
                                    </div>
                                    <p className="text-md font-mdium text-slate-dark">
                                        No tasks have been added to this epic yet
                                    </p>
                                    <Button variant="primary">
                                        <Plus size={18} />
                                        <span className="text-sm font-semibold">Add Task</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
