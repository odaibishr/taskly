interface TaskModalHeaderProps {
    title: string;
    taskId: string;
}

const TaskModalHeader = ({ title, taskId }: TaskModalHeaderProps) => {
    return (
        <div className="py-6 px-8 space-y-2 border-b border-gray-200">
            <div className="flex items-center justify-between bg-surface-highest px-6 py-2 w-fit text-primary font-bold text-xs rounded-sm">
                {taskId && `TASK-${taskId.substring(0, 4).toUpperCase()}`}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
    );
};

export default TaskModalHeader;
