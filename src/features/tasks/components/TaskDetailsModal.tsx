interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    taskId: string;
}

const TaskDetailsModal = ({ isOpen, onClose, projectId, taskId }: TaskDetailsModalProps) => {
    return <div>TaskDetailsModal</div>;
};

export default TaskDetailsModal;
