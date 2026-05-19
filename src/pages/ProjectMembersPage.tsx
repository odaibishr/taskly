import { UserPlusIcon } from "lucide-react"
import Button from "../shared/components/Button"
import { HeaderSection } from "../shared/components/HeaderSection"
import MembersTable from "../features/members/components/MembersTable"

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

            <MembersTable />
        </main>
    )
}

export default ProjectMembersPage