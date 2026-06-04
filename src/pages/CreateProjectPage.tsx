import { CreateProjectForm } from "@/features/projects";
import { HeaderSection } from "@/shared/components/HeaderSection";

const CreateProjectPage = () => {
  return (
    <main>
      <HeaderSection title="Create Project" />
      <CreateProjectForm />
    </main>
  );
};

export default CreateProjectPage;