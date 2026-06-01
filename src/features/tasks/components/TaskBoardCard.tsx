import { Calendar, User } from "lucide-react";
import React from "react";

import type { ProjectTask } from "@/features/tasks/types";
import { cn, getInitials, formatDueDate, getAvatarColors } from "@/shared/lib/utils";

interface TaskBoardCardProps {
    task: ProjectTask;
}

export const TaskBoardCard: React.FC<TaskBoardCardProps> = ({ task }) => {
    const dateBadge = formatDueDate(task.due_date);
    const avColors = task.assignee_name ? getAvatarColors(task.assignee_name) : null;

    const isProgress = task.status === "IN_PROGRESS";
    const isBlocked = task.status === "BLOCKED";

    return (
        <div
            className={cn(
                "bg-white border rounded-xl p-4 flex flex-col gap-3.5 shadow-2xs hover:shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer",
                isProgress
                    ? "border-l-[3.5px] border-l-[#0052CC] border-y-slate-100 border-r-slate-100"
                    : "border-slate-100",
                isBlocked ? "bg-[#FFF5F5]/60 border-[#FEE4E2]" : "",
            )}
        >
            <h4 className="text-[13.5px] font-bold text-[#041B3C] leading-snug tracking-normal line-clamp-3">
                {task.title}
            </h4>

            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="shrink-0">
                    {dateBadge ? (
                        <div className="flex items-center gap-1 text-slate-medium/70 font-semibold text-[10px] tracking-wide">
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-medium/40" />
                            <span>{dateBadge}</span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-medium/30 select-none">—</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                    {task.assignee_name ? (
                        task.assignee_avatar ? (
                            <img
                                src={task.assignee_avatar}
                                alt={task.assignee_name}
                                className="w-5.5 h-5.5 rounded-full object-cover border border-slate-100 shrink-0"
                            />
                        ) : (
                            <div
                                className={cn(
                                    "w-5.5 h-5.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold border shrink-0 select-none",
                                    avColors?.bg,
                                    avColors?.border,
                                )}
                                title={task.assignee_name}
                            >
                                {getInitials(task.assignee_name)}
                            </div>
                        )
                    ) : (
                        <div className="w-5.5 h-5.5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-medium/40 shrink-0">
                            <User className="w-3 h-3" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskBoardCard;
