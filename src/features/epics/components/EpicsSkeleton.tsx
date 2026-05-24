export const EpicsSkeleton = () => {
	return (
		<div className="w-full max-w-full rounded-xl overflow-hidden mx-auto animate-pulse">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="bg-white p-6 rounded-lg border border-gray-100/50 shadow-xs flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<div className="h-6 bg-gray-200 rounded-md w-20"></div>
							<div className="h-4 bg-gray-100 rounded-md w-24"></div>
						</div>
						<div className="space-y-2">
							<div className="h-5 bg-gray-200 rounded-md w-3/4"></div>
							<div className="h-4 bg-gray-100 rounded-md w-full"></div>
						</div>
						<div className="grid grid-cols-2 gap-4 pt-5 mt-5 border-t border-gray-100">
							<div>
								<div className="h-3 bg-gray-100 rounded-md w-12 mb-2"></div>
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
									<div className="h-4 bg-gray-100 rounded-md w-16"></div>
								</div>
							</div>
							<div>
								<div className="h-3 bg-gray-100 rounded-md w-16 mb-2"></div>
								<div className="h-4 bg-gray-100 rounded-md w-20"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
