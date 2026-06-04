import { Calendar, Check, Clock, Layers, User, X } from "lucide-react";

import type { ProjectTask } from "@/features/tasks/types";
import { cn, formatDueDate, getAvatarColors, getInitials } from "@/shared/lib/utils";

interface MobileTaskModalContentProps {
    task: ProjectTask;
    onClose: () => void;
}

const STATUS_BADGES: Record<string, { text: string; bg: string; textClass: string }> = {
    TO_DO: { text: "TO DO", bg: "bg-[#F1F3FF]", textClass: "text-[#4F5F7B]" },
    IN_PROGRESS: { text: "IN PROGRESS", bg: "bg-[#E0ECFF]", textClass: "text-[#0052CC]" },
    BLOCKED: { text: "URGENT", bg: "bg-[#FEE4E2]", textClass: "text-[#D92D20]" },
    IN_REVIEW: { text: "IN REVIEW", bg: "bg-[#FEF0C7]", textClass: "text-[#B54708]" },
    READY_FOR_QA: { text: "READY FOR QA", bg: "bg-[#EFF8FF]", textClass: "text-[#1570EF]" },
    REOPENED: { text: "REOPENED", bg: "bg-[#FDF2FA]", textClass: "text-[#C11574]" },
    READY_FOR_PRODUCTION: { text: "READY PROD", bg: "bg-[#ECFDF3]", textClass: "text-[#027A48]" },
    DONE: { text: "COMPLETED", bg: "bg-[#ECFDF3]", textClass: "text-[#027A48]" },
};

const MobileTaskModalContent = ({ task, onClose }: MobileTaskModalContentProps) => {
    const statusInfo = STATUS_BADGES[task.status] || {
        text: task.status,
        bg: "bg-slate-100",
        textClass: "text-slate-700",
    };

    return (
        <div className="flex md:hidden flex-col p-5 pt-3 space-y-4">
            {/* Top grab handle */}
            <div className="w-12 h-1 bg-slate-300/80 rounded-full mx-auto mb-2" />

            {/* 1. ID and close icon in the same row */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    {task.id && `TASK-${task.id.substring(0, 4).toUpperCase()}`}
                </span>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-slate-200/60 transition-colors text-slate-600 cursor-pointer"
                    aria-label="Close modal"
                >
                    <X size={20} />
                </button>
            </div>

            {/* 2. Title */}
            <div>
                <h2 className="text-xl font-bold text-[#0F2942] leading-snug">{task.title}</h2>
            </div>

            {/* 3. Badges */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                    statusInfo.bg,
                    statusInfo.textClass
                )}>
                    {task.status === "DONE" && (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#027A48] text-white">
                            <Check size={10} strokeWidth={3} />
                        </span>
                    )}
                    {statusInfo.text}
                </span>

                {task.epic_id && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E0ECFF] text-[#0052CC]">
                        <Layers size={12} className="text-[#0052CC]" />
                        {`EPIC-${task.epic_id.substring(0, 4).toUpperCase()}`}
                    </span>
                )}
            </div>

            {/* 4. Grid of 4 square cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Card 1: Assignee */}
                <div className="h-20 flex flex-col justify-between p-3 bg-[#EFF1F6] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assignee</span>
                    <div className="flex items-center gap-2 mt-auto">
                        {task.assignee_name ? (
                            <>
                                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", getAvatarColors(task.assignee_name).bg)}>
                                    {getInitials(task.assignee_name)}
                                </div>
                                <span className="text-xs font-semibold text-[#0F2942] truncate">{task.assignee_name}</span>
                            </>
                        ) : (
                            <>
                                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-200 text-slate-400 shrink-0">
                                    <User size={14} />
                                </div>
                                <span className="text-xs font-semibold text-slate-400">Unassigned</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Card 2: Due Date */}
                <div className="h-20 flex items-center justify-center p-3 bg-[#EFF1F6] rounded-2xl">
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[#0052CC]" />
                        <span className="text-sm font-semibold text-[#0F2942]">
                            {task.due_date ? formatDueDate(task.due_date, "full") : "No Due Date"}
                        </span>
                    </div>
                </div>

                {/* Card 3: Created By */}
                <div className="h-20 flex flex-col justify-between p-3 bg-[#EFF1F6] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Created By</span>
                    <div className="flex items-center gap-2 mt-auto">
                        {task.reporter_name ? (
                            <>
                                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", getAvatarColors(task.reporter_name).bg)}>
                                    {getInitials(task.reporter_name)}
                                </div>
                                <span className="text-xs font-semibold text-[#0F2942] truncate">{task.reporter_name}</span>
                            </>
                        ) : (
                            <>
                                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-slate-200 text-slate-400 shrink-0">
                                    <User size={14} />
                                </div>
                                <span className="text-xs font-semibold text-slate-400">N/A</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Card 4: Created At */}
                <div className="h-20 flex flex-col justify-between p-3 bg-[#EFF1F6] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Created At</span>
                    <div className="flex items-center gap-2 mt-auto">
                        <Clock size={16} className="text-slate-500" />
                        <span className="text-sm font-semibold text-[#0F2942]">
                            {task.created_at ? formatDueDate(task.created_at, "full") : "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            {/* 5. Description */}
            <div className="space-y-2 pt-2 pb-4">
                <h6 className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-1">Description</h6>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {task.description || "No description provided."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileTaskModalContent;
