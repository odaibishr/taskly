import { EllipsisVertical } from "lucide-react"
import Button from "../../../shared/components/Button"
import type { ProjectMember } from "../types"
import { cn, getInitials } from "../../../shared/lib/utils"

const MemberRow = ({ member }: { member: ProjectMember }) => {
    return (
        <tr key={member.id} className="border-b border-gray-100 hover:bg-[#E0E8FF4D]/30">
            <td className="px-8 py-5 text-slate-medium flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#DAE2FF] py-3 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#3B82F6]">
                        {member.avatar_url ? (
                            <img
                                src={member.avatar_url}
                                alt={member.name}
                                className="w-full h-full rounded-xl object-cover"
                            />
                        ) : (
                            <span className="text-sm font-bold leading-5 text-primary">
                                {getInitials(member.name)}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg leading-5 font-semibold text-slate-dark">
                        {member.name}
                    </h3>
                    <p className="text-sm text-slate-medium">
                        {member.email}
                    </p>

                </div>
            </td>
            <td className="px-8 py-5 text-slate-medium text-right md:text-left">
                <span className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize",
                    member.role === "owner" ? "bg-primary text-white"
                        : member.role === "admin" ? "bg-[#CDDDFF] text-[#51617E]"
                            : member.role === "member" ? "bg-[#D7E2FF] text-[#434654]"
                                : "bg-[#E8EDFF] text-[#434654]"
                )}>

                    {member.role}
                </span>
            </td>
            <td className="px-8 py-5 text-slate-medium text-right md:text-left">
                {member.role !== "owner" && (
                    <Button variant="ghost">
                        <EllipsisVertical size={20} />
                    </Button>
                )}
            </td>
        </tr>
    )
}

export default MemberRow