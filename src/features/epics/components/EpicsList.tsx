import { ChevronLeft, ChevronRight } from "lucide-react";

import { EmptyEpics } from "./EmptyEpics";

import type { ProjectEpic } from "@/features/epics/types";
import Button from "@/shared/components/Button";
import { getInitials } from "@/shared/lib/utils";

export { EmptyEpics } from "./EmptyEpics";
export { EpicsSkeleton } from "./EpicsSkeleton";

interface EpicsListProps {
    epics: ProjectEpic[];
    onCreateEpic: () => void;
    onEpicClick?: (epicId: string) => void;
    currentPage: number;
    totalCount: number;
    limit: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const EpicsList = ({
    epics,
    onCreateEpic,
    onEpicClick,
    currentPage,
    totalCount,
    limit,
    onPageChange,
    isLoading,
}: EpicsListProps) => {
    if (epics.length === 0) {
        return <EmptyEpics onCreateEpic={onCreateEpic} />;
    }

    const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="w-full max-w-full rounded-xl overflow-hidden animate-in fade-in duration-300 mx-auto">
            {/* Epics Grid View - 1 Column on Mobile, 2 Columns on MD and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {epics.map((epic) => (
                    <div
                        key={epic.id}
                        className="bg-white hover:shadow-[0px_24px_48px_0px_#041B3C0F] hover:-translate-y-1 transition-all duration-300 rounded-lg flex flex-col justify-between p-6 border border-gray-100/50 cursor-pointer"
                        onClick={() => onEpicClick?.(epic.id)}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E0E8FF] px-2.5 py-1 text-xs font-bold text-primary uppercase border border-[#CDDDFF]">
                                    {epic.epic_id}
                                </span>
                                <span className="text-[11px] font-bold uppercase text-[#737685]">
                                    {new Date(epic.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3
                                    className="text-lg font-bold text-slate-dark leading-snug truncate"
                                    title={epic.title}
                                >
                                    {epic.title}
                                </h3>
                                {epic.description && (
                                    <p
                                        className="text-slate-medium text-sm line-clamp-3"
                                        title={epic.description}
                                    >
                                        {epic.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-5 mt-5 border-t border-gray-100/80 text-xs">
                            <div>
                                <span className="text-[#737685] font-bold uppercase tracking-wider block mb-1.5">
                                    Assignee
                                </span>
                                {epic.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#DAE2FF] flex items-center justify-center text-xs font-bold text-primary overflow-hidden shrink-0">
                                            {getInitials(epic.assignee.name)}
                                        </div>
                                        <span
                                            className="text-slate-dark font-semibold truncate"
                                            title={epic.assignee.name}
                                        >
                                            {epic.assignee.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-medium italic leading-8">
                                        Unassigned
                                    </span>
                                )}
                            </div>

                            <div>
                                <span className="text-[#737685] font-bold uppercase tracking-wider block mb-1.5">
                                    Created By
                                </span>
                                <div className="flex items-center h-8">
                                    <span
                                        className="text-slate-dark font-semibold truncate block"
                                        title={epic.created_by.name}
                                    >
                                        {epic.created_by.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-6 mt-8 border-t border-gray-100">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-500">
                            Showing page <span className="font-bold text-black">{currentPage}</span> of {totalPages}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => onPageChange(currentPage - 1)}
                            variant="outline"
                            className="w-10 h-12 p-2"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button
                                    key={i + 1}
                                    disabled={isLoading}
                                    onClick={() => onPageChange(i + 1)}
                                    variant={currentPage === i + 1 ? "primary" : "outline"}
                                    className="w-10 h-12 p-2"
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>

                        <Button
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => onPageChange(currentPage + 1)}
                            variant="outline"
                            className="w-10 h-12 p-2"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
