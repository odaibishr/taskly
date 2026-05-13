import { useProjecteStore } from "../store/projects.store";

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
				<button
					disabled={currentPage === 1 || isLoading}
					onClick={() => setPage(currentPage - 1)}
					className="p-2 border rounded-lg disabled:opacity-50"
				>
					Previous
				</button>

				{/* عرض أرقام الصفحات */}
				<div className="flex gap-1">
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i + 1}
							onClick={() => setPage(i + 1)}
							className={`w-10 h-10 rounded-lg font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
						>
							{i + 1}
						</button>
					))}
				</div>
				<button
					disabled={currentPage === totalPages || isLoading}
					onClick={() => setPage(currentPage + 1)}
					className="p-2 border rounded-lg disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Pagination;
