import { UserPlusIcon } from "lucide-react"
import Button from "../shared/components/Button"
import { HeaderSection } from "../shared/components/HeaderSection"

const ProjectMembersPage = () => {
    return (
        <main>
            <HeaderSection title="Project Members" isBreadcrumbVisible={true} >
                <Button
                    variant="primary"
                    className="flex items-center gap-2"
                >
                    <UserPlusIcon size={20} />
                    Invite Members
                </Button>
            </HeaderSection>
        </main>
    )
}

export default ProjectMembersPage