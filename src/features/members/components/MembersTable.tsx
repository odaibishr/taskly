import { Users } from "lucide-react"

import MemberRow from "@/features/members/components/MemberRow"
import type { ProjectMember } from "@/features/members/types"

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
        <div className="w-full max-w-full lg:w-255 rounded-xl overflow-hidden animate-in fade-in duration-300 mx-auto">
            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-150 text-left border-collapse p-1 bg-surface-low rounded-lg">
                    <thead className="bg-[#E0E8FF4D] h-1/3">
                        <tr className="border-b border-gray-100 bg-[#E0E8FF4D]/30">
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider">
                                Member
                            </th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider text-right md:text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {members.map((member) => (
                            <MemberRow key={member.id} member={member} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MembersTable