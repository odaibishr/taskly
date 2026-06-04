import { EllipsisVertical, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { useRef, useState } from "react";

import { useMembersStore } from "@/features/members/store/members.store";
import type { ProjectMember, ProjectRole } from "@/features/members/types";
import Button from "@/shared/components/Button";
import { cn, getInitials } from "@/shared/lib/utils";

const ROLE_OPTIONS: { label: string; role: ProjectRole }[] = [
    { label: "Admin", role: "admin" },
    { label: "Member", role: "member" },
    { label: "Viewer", role: "viewer" },
];

const MemberRow = ({
    member,
    projectId,
}: {
    member: ProjectMember;
    projectId: string;
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const updateMemberRole = useMembersStore((s) => s.updateMemberRole);
    const removeMember = useMembersStore((s) => s.removeMember);

    const displayName =
        member.name ||
        (member as ProjectMember & { full_name?: string }).full_name ||
        member.email.split("@")[0];

    const handleRoleChange = async (newRole: ProjectRole) => {
        setMenuOpen(false);
        await updateMemberRole(member.id, projectId, newRole);
    };

    const handleRemove = async () => {
        setMenuOpen(false);
        await removeMember(member.id, projectId);
    };

    return (
        <tr key={member.id} className="border-b border-gray-100 hover:bg-[#E0E8FF4D]/30">
            <td className="px-8 py-5 text-slate-medium flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#DAE2FF] py-3 flex items-center justify-center">
                    <span className="text-sm font-medium text-[#3B82F6]">
                        {member.avatar_url ? (
                            <img
                                src={member.avatar_url}
                                alt={displayName}
                                className="w-full h-full rounded-xl object-cover"
                            />
                        ) : (
                            <span className="text-sm font-bold leading-5 text-primary">
                                {getInitials(displayName)}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg leading-5 font-semibold text-slate-dark">{displayName}</h3>
                    <p className="text-sm text-slate-medium">{member.email}</p>
                </div>
            </td>

            <td className="px-8 py-5 text-slate-medium text-right md:text-left">
                <span
                    className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize",
                        member.role === "owner"
                            ? "bg-primary text-white"
                            : member.role === "admin"
                              ? "bg-[#CDDDFF] text-[#51617E]"
                              : member.role === "member"
                                ? "bg-[#D7E2FF] text-[#434654]"
                                : "bg-[#E8EDFF] text-[#434654]",
                    )}
                >
                    {member.role}
                </span>
            </td>

            <td className="px-8 py-5 text-slate-medium text-right md:text-left relative">
                {member.role !== "owner" && (
                    <div ref={menuRef} className="inline-block">
                        <Button
                            variant="ghost"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Member actions"
                            id={`member-actions-${member.id}`}
                        >
                            <EllipsisVertical size={20} />
                        </Button>

                        {menuOpen && (
                            <>
                                {/* Backdrop to close menu on outside click */}
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 w-48 py-1 animate-in fade-in zoom-in-95 duration-150">
                                    {/* Role section */}
                                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-medium">
                                        Change Role
                                    </p>
                                    {ROLE_OPTIONS.filter((o) => o.role !== member.role).map((opt) => (
                                        <button
                                            key={opt.role}
                                            onClick={() => handleRoleChange(opt.role)}
                                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-dark hover:bg-slate-50 transition-colors cursor-pointer"
                                            id={`set-role-${opt.role}-${member.id}`}
                                        >
                                            {opt.role === "admin" ? (
                                                <ShieldCheck size={15} className="text-primary" />
                                            ) : (
                                                <UserCog size={15} className="text-slate-medium" />
                                            )}
                                            <span className="capitalize">{opt.label}</span>
                                        </button>
                                    ))}

                                    <div className="border-t border-gray-100 mt-1" />

                                    {/* Remove section */}
                                    <button
                                        onClick={handleRemove}
                                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        id={`remove-member-${member.id}`}
                                    >
                                        <Trash2 size={15} />
                                        Remove Member
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};

export default MemberRow;