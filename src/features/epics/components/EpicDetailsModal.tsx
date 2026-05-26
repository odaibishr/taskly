interface EpicDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    epicId: string;
}

const EpicDetailsModal = ({ isOpen, onClose, projectId, epicId }: EpicDetailsModalProps) => {
    return <div>EpicDetailsModal</div>;
};

export default EpicDetailsModal;
