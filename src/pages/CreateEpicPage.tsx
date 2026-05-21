import { CreateEpicForm } from "@/features/epics"
import { HeaderSection } from "@/shared/components/HeaderSection"

const CreateEpicPage = () => {
  return (
    <main>
      <HeaderSection title="Create Epic" isBreadcrumbVisible={true} />
      <CreateEpicForm />
    </main>
  )
}

export default CreateEpicPage
