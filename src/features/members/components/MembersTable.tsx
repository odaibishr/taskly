import type { ProjectMember } from "../types"

interface MembersTableProps {
    members: ProjectMember[],
}


const MembersTable = ({ members }: MembersTableProps) => {
    return (
        <div>MembersTable</div>
    )
}

export default MembersTable