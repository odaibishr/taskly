import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = () => {
	return (
		<div className="flex items-center justify-between px-2 py-6 mt-8 border-t border-gray-100">
			<div className="hidden sm:block">
				<p className="text-sm text-slate-medium">
					Showing <span className="font-semibold text-slate-dark">1</span> to <span className="font-semibold text-slate-dark">6</span> of <span className="font-semibold text-slate-dark">24</span> projects
				</p>
			</div>

			<div className="flex flex-1 justify-between sm:justify-end gap-2">
				<button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-slate-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
					<ChevronLeft size={20} />
				</button>

				<div className="flex gap-1">
					<button className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-sm">
						1
					</button>
					<button className="w-10 h-10 rounded-lg text-slate-medium font-bold text-sm hover:bg-gray-50 transition-colors">
						2
					</button>
					<button className="w-10 h-10 rounded-lg text-slate-medium font-bold text-sm hover:bg-gray-50 transition-colors">
						3
					</button>
				</div>

				<button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-slate-medium hover:bg-gray-50 transition-colors">
					<ChevronRight size={20} />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
