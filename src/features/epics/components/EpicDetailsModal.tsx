import { X, Calendar, User, Plus, Loader2, List } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import EpicDetail from "@/assets/EpicDetail.svg";
import { useEpicsStore } from "@/features/epics/store/epics.store";
import type { ProjectEpic } from "@/features/epics/types";
import { useProjectMembers } from "@/features/members/hooks/useProjectMembers";
import Button from "@/shared/components/Button";
import { getInitials } from "@/shared/lib/utils";
import { useToastStore } from "@/shared/store/toast.store";

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
        updateEpicDetails,
        getEpicsByProjectId,
    } = useEpicsStore(
        useShallow((state) => ({
            selectedEpic: state.selectedEpic,
            isSelectedEpicLoading: state.isSelectedEpicLoading,
            selectedEpicError: state.selectedEpicError,
            getEpicDetails: state.getEpicDetails,
            setSelectedEpic: state.setSelectedEpic,
            updateEpicDetails: state.updateEpicDetails,
            getEpicsByProjectId: state.getEpicsByProjectId,
        }))
    );

    const { members } = useProjectMembers();
    const { addToast } = useToastStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

    useEffect(() => {
        if (selectedEpic) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(selectedEpic.title);
            setDescription(selectedEpic.description || "");
            setDeadline(selectedEpic.deadline);
        }
    }, [selectedEpic]);

    const handleUpdate = async (field: string, value: string | null) => {
        if (!selectedEpic) return;
        
        // Don't update if value hasn't changed
        if (field === "title" && value === selectedEpic.title) return;
        if (field === "description" && value === (selectedEpic.description || "")) return;
        if (field === "deadline" && value === selectedEpic.deadline) return;

        // Perform optimistic update
        const previousEpic = { ...selectedEpic };
        const updatedSelectedEpic = { ...selectedEpic } as ProjectEpic;

        if (field === "title" && value) {
            if (!value.trim()) {
                addToast("Title is required", "error");
                setTitle(selectedEpic.title); // Revert local state
                return;
            }
            updatedSelectedEpic.title = value.trim();
        }
        if (field === "description") {
            updatedSelectedEpic.description = value ? value.trim() || null : null;
        }
        if (field === "deadline") {
            updatedSelectedEpic.deadline = value || null;
        }
        if (field === "assignee_id") {
            if (value === null) {
                updatedSelectedEpic.assignee = null;
            } else {
                const member = members.find((m) => m.id === value);
                updatedSelectedEpic.assignee = member
                    ? {
                            sub: member.id,
                            name: member.name,
                            email: member.email,
                            department: member.role || "Member",
                      }
                    : null;
            }
        }

        setIsUpdating(true);
        setSelectedEpic(updatedSelectedEpic);

        try {
            const payloadValue = (field === "title" || field === "description") && value
                ? value.trim() || null
                : value;
            
            await updateEpicDetails(selectedEpic.id, { [field]: payloadValue });
            getEpicsByProjectId(projectId);
            addToast("Epic updated successfully!", "success");
        } catch {
            setSelectedEpic(previousEpic);
            // Revert local states
            if (field === "title") setTitle(previousEpic.title);
            if (field === "description") setDescription(previousEpic.description || "");
            if (field === "deadline") setDeadline(previousEpic.deadline);
            addToast("Failed to update epic. Please try again.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleTitleBlur = () => {
        handleUpdate("title", title);
    };

    const handleDescriptionBlur = () => {
        handleUpdate("description", description);
    };

    const handleAssigneeSelect = (memberId: string | null) => {
        setIsAssigneeDropdownOpen(false);
        handleUpdate("assignee_id", memberId);
    };

    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value || null;
        setDeadline(val);
        handleUpdate("deadline", val);
    };

    const handleDeadlineClear = () => {
        setDeadline(null);
        handleUpdate("deadline", null);
    };

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

    const formatDate = (dateString?: string | null) => {
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
                        {/* Modal Header */}
                        <div className="flex items-start justify-between p-6">
                            <div className="space-y-1.5 pr-8 flex-1">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                                    <img src={EpicDetail} alt="EpicDetail" />
                                    {selectedEpic.epic_id || "Epic"}
                                </span>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={handleTitleBlur}
                                    disabled={isUpdating}
                                    className="text-xl md:text-2xl font-bold text-slate-dark leading-snug bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary focus:outline-none w-full px-2 py-1 transition-all rounded"
                                    placeholder="Enter Epic Title..."
                                    required
                                />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-medium hover:bg-slate-low hover:text-slate-dark transition-all cursor-pointer shrink-0 ml-4 mt-1"
                                aria-label="Close modal"
                                id="close-epic-modal-btn"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-medium block">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={handleDescriptionBlur}
                                    disabled={isUpdating}
                                    placeholder="No description provided"
                                    rows={4}
                                    className="text-slate-dark text-sm leading-relaxed bg-transparent border border-transparent hover:border-gray-200 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary w-full px-3 py-2 transition-all resize-none rounded italic:placeholder"
                                />
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

                                <div className="space-y-2 relative">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                        Assignee
                                    </h4>
                                    <button
                                        onClick={() => !isUpdating && setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2.5 w-full text-left p-1.5 -m-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {selectedEpic.assignee ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center shrink-0 bg-slate-low/50">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-medium italic">Unassigned</span>
                                            </>
                                        )}
                                    </button>

                                    {isAssigneeDropdownOpen && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setIsAssigneeDropdownOpen(false)} 
                                            />
                                            <div className="absolute z-20 mt-1 w-56 bg-white rounded-xl shadow-[0_12px_32px_rgba(4,27,60,0.16)] border border-gray-100 py-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => handleAssigneeSelect(null)}
                                                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left hover:bg-slate-50 text-slate-medium italic cursor-pointer"
                                                >
                                                    <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center bg-slate-low/50 text-gray-400">
                                                        <User size={12} />
                                                    </div>
                                                    Unassigned
                                                </button>
                                                {members.map((member) => (
                                                    <button
                                                        key={member.id}
                                                        onClick={() => handleAssigneeSelect(member.id)}
                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left hover:bg-slate-50 text-slate-dark font-medium cursor-pointer"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-[#DAE2FF] text-primary flex items-center justify-center text-[10px] font-bold">
                                                            {getInitials(member.name)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate">{member.name}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                            Deadline
                                        </h4>
                                        {deadline && (
                                            <button
                                                onClick={handleDeadlineClear}
                                                disabled={isUpdating}
                                                className="text-[10px] font-bold text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2.5 text-slate-dark">
                                        <div className="w-8 h-8 rounded-full bg-slate-low flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-slate-medium" />
                                        </div>
                                        <input
                                            type="date"
                                            value={deadline || ""}
                                            onChange={handleDeadlineChange}
                                            disabled={isUpdating}
                                            className="text-sm font-semibold text-slate-dark bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary focus:outline-none py-0.5 px-2 cursor-pointer rounded"
                                        />
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
                                            <p className="text-sm font-semibold">
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
                                    <p className="text-sm font-medium text-slate-dark">
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
