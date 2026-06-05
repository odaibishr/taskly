import type { TaskStatus } from "@/features/tasks";
import { TASK_STATUSES, TASK_STATUS_MAP } from "@/features/tasks/constants";
import { cn, formatDueDate } from "@/shared/lib/utils";

interface LeftTaskModalContentProps {
    taskId: string;
    status: TaskStatus;
    assignee_name?: string;
    reporter_name?: string;
    created_at?: string;
    due_date?: string;
    /** Called when the user changes the task status from the dropdown. */
    onStatusChange?: (status: TaskStatus) => void;
}

const LeftTaskModalContent = ({
    taskId: _taskId,
    status,
    assignee_name,
    reporter_name,
    created_at,
    due_date,
    onStatusChange,
}: LeftTaskModalContentProps) => {
    const activeStatus = TASK_STATUS_MAP[status];

    return (
        <div className="bg-surface-highest w-[25%] border-l border-l-surface-low p-8 flex flex-col gap-8">
            <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-medium text-[#434654]">Status</p>
                <select
                    value={status}
                    onChange={(e) => onStatusChange?.(e.target.value as TaskStatus)}
                    className={cn(
                        "w-full text-white border border-surface-low rounded-lg p-2 outline-none ring-none border-none cursor-pointer",
                        activeStatus?.dotColor,
                    )}
                    aria-label="Task status"
                >
                    {TASK_STATUSES.map((s) => (
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

export default LeftTaskModalContent;
