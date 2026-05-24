import { UserPlusIcon } from "lucide-react";
import Button from "@/shared/components/Button";
import { HeaderSection } from "@/shared/components/HeaderSection";
import {
	MembersTable,
	MembersTableSkeleton,
} from "@/features/members";
import ErrorCard from "@/shared/components/ErrorCard";
import { useProjectMembers } from "@/features/members/hooks/useProjectMembers";

const ProjectMembersPage = () => {
	const { projectId, members, isLoading, error, getMembers } = useProjectMembers();

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
					>
						<UserPlusIcon size={20} />
						Invite Members
					</Button>
				)}
			</HeaderSection>

			{isLoading ? (
				<MembersTableSkeleton />
			) : (
				<MembersTable members={members} />
			)}
		</main>
	);
};

export default ProjectMembersPage;