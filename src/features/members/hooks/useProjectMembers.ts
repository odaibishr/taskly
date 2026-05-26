import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useMembersStore } from "@/features/members/store/members.store";

export function useProjectMembers() {
	const { projectId } = useParams<{ projectId: string }>();
	const { members, isLoading, error, getMembers } = useMembersStore();

	useEffect(() => {
		if (projectId) {
			getMembers(projectId);
		}
	}, [projectId, getMembers]);

	return { projectId, members, isLoading, error, getMembers };
}
