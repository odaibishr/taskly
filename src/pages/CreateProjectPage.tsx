import { UserPlus } from "lucide-react"
import { CreateProjectForm } from "../features/projects"
import Button from "../shared/components/Button"
import { HeaderSection } from "../shared/components/HeaderSection"

const CreateProjectPage = () => {
  return (
    <main>
      <HeaderSection title="Create Project">
        <Button
          variant="primary"
          className="max-md:hidden cursor-pointer flex gap-3 items-center shadow-md"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </Button>
      </HeaderSection>
      <CreateProjectForm />
    </main>
  )
}

export default CreateProjectPage