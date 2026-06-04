import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useTasksStore } from "@/features/tasks/store/tasks.store";

export function useTasksList(projectId: string) {
    const {
        projectTasks: tasks,
        totalTasks,
        isProjectTasksLoading: isLoading,
        projectTasksError: error,
        getProjectTasks,
        clearProjectTasks,
    } = useTasksStore(
        useShallow((state) => ({
            projectTasks: state.projectTasks,
            totalTasks: state.totalTasks,
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
            const offset = (currentPage - 1) * itemsPerPage;
            getProjectTasks(projectId, itemsPerPage, offset, false);
        }
    }, [projectId, currentPage, getProjectTasks]);

    useEffect(() => {
        return () => {
            clearProjectTasks();
        };
    }, [clearProjectTasks]);

    const totalPages = Math.ceil(totalTasks / itemsPerPage) || 1;

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return {
        tasks,
        currentTasks: tasks,
        totalTasks,
        isLoading,
        error,
        currentPage,
        totalPages,
        retry: () => {
            const offset = (currentPage - 1) * itemsPerPage;
            getProjectTasks(projectId, itemsPerPage, offset, false);
        },
        goToNextPage,
        goToPrevPage,
    };
}
