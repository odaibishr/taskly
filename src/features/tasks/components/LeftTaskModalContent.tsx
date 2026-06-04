import type { TaskStatus } from "@/features/tasks";
import { cn, formatDueDate } from "@/shared/lib/utils";

const TaskStatusSelect: { status: TaskStatus; label: string; dotColor: string }[] = [
    { status: "TO_DO", label: "TO DO", dotColor: "bg-[#3B66F5]" },
    { status: "IN_PROGRESS", label: "IN PROGRESS", dotColor: "bg-[#0052CC]" },
    { status: "BLOCKED", label: "BLOCKED", dotColor: "bg-[#D92D20]" },
    { status: "IN_REVIEW", label: "IN REVIEW", dotColor: "bg-[#B54708]" },
    { status: "READY_FOR_QA", label: "READY FOR QA", dotColor: "bg-[#1570EF]" },
    { status: "REOPENED", label: "REOPENED", dotColor: "bg-[#C11574]" },
    { status: "READY_FOR_PRODUCTION", label: "READY FOR PRODUCTION", dotColor: "bg-[#027A48]" },
    { status: "DONE", label: "DONE", dotColor: "bg-[#027A48]" },
];

interface LeftTaskModalContentProps {
    status: string;
    assignee_name?: string;
    reporter_name?: string;
    created_at?: string;
    due_date?: string;
}

const LeftTaskModalContent = ({
    status,
    assignee_name,
    reporter_name,
    created_at,
    due_date,
}: LeftTaskkModalContentProps) => {
    return (
        <div className="bg-surface-highest w-[25%] border-l border-l-surface-low p-8 flex flex-col gap-8">
            <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-medium text-[#434654]">Status</p>
                <select
                    className={cn(
                        "w-full text-white border border-surface-low rounded-lg p-2 outline-none ring-none border-none cursor-pointer",
                        TaskStatusSelect.find((s) => s.status === status)?.dotColor,
                    )}
                >
                    <option value={status}>
                        {TaskStatusSelect.find((s) => s.status === status)?.label}
                    </option>
                    {TaskStatusSelect.map((s) => (
                        <option key={s.status} value={s.status}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>
            {assignee_name && (
                <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-medium text-[#434654]">assignee</p>
                    <p className="text-[#434654] text-sm">{assignee_name}</p>
                </div>
            )}
            {reporter_name && (
                <div className="space-y-1.5 border border-b-surface-low">
                    <p className="text-[10px] uppercase font-medium text-[#434654]">reporter</p>
                    <p className="text-[#434654] text-sm">{reporter_name}</p>
                </div>
            )}

            <div className="space-y-4">
                {due_date && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#434654]">Due Date</span>
                        <span className="text-xs text-slate-dark ">{formatDueDate(due_date, "short")}</span>
                    </div>
                )}
                {created_at && (
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#434654]">Created Date</span>
                        <span className="text-xs text-slate-dark ">{formatDueDate(created_at, "short")}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeftTaskkModalContent;
