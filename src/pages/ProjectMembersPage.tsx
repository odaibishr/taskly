import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

import {
	MembersTable,
	MembersTableSkeleton,
	InviteMemberModal,
} from "@/features/members";
import { useProjectMembers } from "@/features/members/hooks/useProjectMembers";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";

const ProjectMembersPage = () => {
	const { projectId, members, isLoading, error, getMembers } = useProjectMembers();
	const [isInviteOpen, setIsInviteOpen] = useState(false);

	if (error) {
		return (
			<main>
				<HeaderSection title="Project Members" isBreadcrumbVisible={true} />
				<ErrorCard
					retryAction={() => projectId && getMembers(projectId)}
					description="We're having trouble retrieving the members for this project. Please try again in a moment."
				/>
			</main>
		);
	}

	return (
		<main>
			<HeaderSection title="Project Members" isBreadcrumbVisible={true}>
				{isLoading ? (
					<div className="max-md:hidden w-40 h-10 bg-gray-200 rounded-lg animate-pulse" />
				) : (
					<Button
						variant="primary"
						className="flex items-center gap-2"
						onClick={() => setIsInviteOpen(true)}
						id="invite-members-btn"
					>
						<UserPlusIcon size={20} />
						Invite Members
					</Button>
				)}
			</HeaderSection>

			{isLoading ? (
				<MembersTableSkeleton />
			) : (
				<MembersTable members={members} projectId={projectId ?? ""} />
			)}

			{projectId && (
				<InviteMemberModal
					isOpen={isInviteOpen}
					onClose={() => setIsInviteOpen(false)}
					projectId={projectId}
				/>
			)}
		</main>
	);
};

export default ProjectMembersPage;