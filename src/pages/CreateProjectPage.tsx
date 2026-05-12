import CreateProjectForm from "../features/projects/components/CreateProjectForm"
import { HeaderSection } from "../shared/components/HeaderSection"

const CreateProjectPage = () => {
  return (
    <main>
      <HeaderSection title="Create Project" />
      <CreateProjectForm />
    </main>
  )
}

export default CreateProjectPage