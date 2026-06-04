import Button from "@/shared/components/Button";
import { Link2 } from "lucide-react";
import TaskModalHeader from "./TaskModalHeader";

interface RightTaskModalContentPrps {
    id: string;
    title: string;
    description?: string;
    onClose: () => void;
}

const RightTaskModalContent = ({ id, title, description, onClose }: RightTaskModalContentPrps) => (
    <div className="flex-1 flex flex-col items  pt-6">
        <TaskModalHeader taskId={id} title={title} />

        <div className="flex-1 flex flex-col items-stretch justify-between gap-10 pt-8">
            <div className="flex-1 space-y-2 px-8">
                <h6 className="text-xs uppercase text-[#434654] font-bold">Description</h6>
                <p className="text-md text-[#434654]">{description && description}</p>
            </div>

            <div className="flex justify-between items-center py-4 px-8 bg-surface-low">
                <Button
                    variant="ghost"
                    className="flex items-center text-sm gap-2 group cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                >
                    <Link2 size={18} />
                    Copy Link
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    </div>
);

export default RightTaskModalContent;
