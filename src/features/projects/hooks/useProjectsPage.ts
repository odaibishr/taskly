import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useProjectsStore } from "@/features/projects/store/projects.store";
import { ROUTES } from "@/shared/lib/routes";

export function useProjectsPage() {
	const { projects, getProjects, isLoading, error, loadNextPage } = useProjectsStore();
	const navigate = useNavigate();
	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					loadNextPage();
				}
			},
			{ threshold: 1.0 }
		);
		if (observerTarget.current) observer.observe(observerTarget.current);
		return () => observer.disconnect();
	}, [isLoading, loadNextPage]);

	const handleProjectClick = (projectId: string) => {
		navigate(`${ROUTES.PROJECTS}/${projectId}/epics`);
	};

	return { projects, isLoading, error, getProjects, observerTarget, handleProjectClick };
}
