import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useTasksStore } from "@/features/tasks/store/tasks.store";

export function useTasksList(projectId: string) {
    const {
        projectTasks: tasks,
        isProjectTasksLoading: isLoading,
        projectTasksError: error,
        getProjectTasks,
        clearProjectTasks,
    } = useTasksStore(
        useShallow((state) => ({
            projectTasks: state.projectTasks,
            isProjectTasksLoading: state.isProjectTasksLoading,
            projectTasksError: state.projectTasksError,
            getProjectTasks: state.getProjectTasks,
            clearProjectTasks: state.clearProjectTasks,
        }))
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (projectId) {
            getProjectTasks(projectId);
        }
        return () => {
            clearProjectTasks();
        };
    }, [projectId, getProjectTasks, clearProjectTasks]);

    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTasks = tasks.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return {
        tasks,
        currentTasks,
        isLoading,
        error,
        currentPage,
        totalPages,
        retry: () => getProjectTasks(projectId),
        goToNextPage,
        goToPrevPage,
    };
}
