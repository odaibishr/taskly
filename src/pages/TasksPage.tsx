import { TasksBoardView } from "@/features/tasks";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";
import { useParams } from "react-router-dom";

const TasksPage = () => {
    const { projectId } = useParams<{ projectId: string }>();

    return (
        <main className="w-full">
            <HeaderSection
                title="Active Workboard"
                description="Curating Project Alpha's production pipeline and milestones."
                isBreadcrumbVisible={true}
            />
            {projectId ? (
                <TasksBoardView projectId={projectId} />
            ) : (
                <ErrorCard retryAction={() => {}} />
            )}
        </main>
    );
};

export default TasksPage;
