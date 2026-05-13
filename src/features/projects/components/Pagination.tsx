import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProjecteStore } from "../store/projects.store";
import Button from "../../../shared/components/Button";

const Pagination = () => {
	const { pagination, setPage, isLoading } = useProjecteStore();
	const { currentPage, limit, totalCount } = pagination;

	const totalPages = Math.ceil(totalCount / limit);
	if (totalPages <= 1) return null;
	return (
		<div className="flex items-center justify-between py-6 mt-8 border-t border-gray-100">
			<div className="hidden sm:block">
				<p className="text-sm text-gray-500">
					Showing page <span className="font-bold text-black">{currentPage}</span> of {totalPages}
				</p>
			</div>
			<div className="flex gap-2">
				<Button
					disabled={currentPage === 1 || isLoading}
					onClick={() => setPage(currentPage - 1)}
					variant="outline"
					className="w-10 h-12 p-2"
				>
					<ChevronLeft className="size-5" />
				</Button>

				<div className="flex gap-1">
					{Array.from({ length: totalPages }, (_, i) => (
						<Button
							key={i + 1}
							onClick={() => setPage(i + 1)}
							variant={currentPage === i + 1 ? "primary" : "outline"}
							className="w-10 h-12 p-2"
						>
							{i + 1}
						</Button>
					))}
				</div>
				<Button
					disabled={currentPage === totalPages || isLoading}
					onClick={() => setPage(currentPage + 1)}
					variant="outline"
					className="w-10 h-12 p-2"
				>
					<ChevronRight className="size-5" />
				</Button>
			</div>
		</div>
	);
};

export default Pagination;
