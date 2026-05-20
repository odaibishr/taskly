import { Users } from "lucide-react"
import type { ProjectMember } from "../types"

interface MembersTableProps {
    members: ProjectMember[],
}


const MembersTable = ({ members }: MembersTableProps) => {

    if (members.length === 0) {
        return (
            <div
                className="w-full bg-white rounded-xl border border-gray-100 shadow-xs p-12 text-center flex flex-col items-center justify-center"
            >
                <Users
                    size={48} className="text-slate-medium mb-4" />
                <p className="text-slate-medium font-medium">No members found in this project.</p>
            </div>
        )
    }
    return (
        <div>MembersTable</div>
    )
}

export default MembersTable