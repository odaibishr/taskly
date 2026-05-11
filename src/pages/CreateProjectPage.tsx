import Button from "../shared/components/Button"
import { HeaderSection } from "../shared/components/HeaderSection"

const CreateProjectPage = () => {
  return (
    <main>
      <HeaderSection />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Project</h1>
        <Button>Create Project</Button>
      </div>
    </main>
  )
}

export default CreateProjectPage