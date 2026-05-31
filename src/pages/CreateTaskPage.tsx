import { CreateTaskForm } from "@/features/tasks";
import { HeaderSection } from "@/shared/components/HeaderSection";

const CreateTaskPage = () => {
    return (
        <main>
            <HeaderSection
                title="Create New Task"
                description="Initialize a new work item within the Architectural Workspace ecosystem."
                isBreadcrumbVisible={true}
            />
            <CreateTaskForm />
        </main>
    );
};

export default CreateTaskPage;
