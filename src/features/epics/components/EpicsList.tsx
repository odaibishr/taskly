import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/shared/components/Button";
import { getInitials } from "@/shared/lib/utils";
import type { ProjectEpic } from "@/features/epics/types";
import { EmptyEpics } from "./EmptyEpics";

export { EmptyEpics } from "./EmptyEpics";
export { EpicsSkeleton } from "./EpicsSkeleton";

interface EpicsListProps {
    epics: ProjectEpic[];
    onCreateEpic: () => void;
    onEpicClick?: (epicId: string) => void;
}

export const EpicsList = ({ epics, onCreateEpic, onEpicClick }: EpicsListProps) => {
    if (epics.length === 0) {
        return <EmptyEpics onCreateEpic={onCreateEpic} />;
    }

    return (
        <div className="w-full max-w-full rounded-xl overflow-hidden animate-in fade-in duration-300 mx-auto">
            {/* Epics Grid View - 1 Column on Mobile, 2 Columns on MD and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {epics.map((epic) => (
                    <div
                        key={epic.id}
                        className="bg-white hover:shadow-[0px_24px_48px_0px_#041B3C0F] hover:-translate-y-1 transition-all duration-300 rounded-lg flex flex-col justify-between p-6 border border-gray-100/50"
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

            {/* Mocked Pagination Controls */}
            <div className="flex items-center justify-between py-6 mt-8 border-t border-gray-100">
                <div className="hidden sm:block">
                    <p className="text-sm text-gray-500">
                        Showing page <span className="font-bold text-black">1</span> of 1
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        disabled
                        variant="outline"
                        className="w-10 h-12 p-2 opacity-50 cursor-not-allowed"
                    >
                        <ChevronLeft className="size-5" />
                    </Button>

                    <div className="flex gap-1">
                        <Button
                            disabled
                            variant="primary"
                            className="w-10 h-12 p-2 cursor-not-allowed"
                        >
                            1
                        </Button>
                    </div>

                    <Button
                        disabled
                        variant="outline"
                        className="w-10 h-12 p-2 opacity-50 cursor-not-allowed"
                    >
                        <ChevronRight className="size-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
