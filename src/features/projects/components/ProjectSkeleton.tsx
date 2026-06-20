
const ProjectSkeleton = () => {
	return (
		<div className="bg-white min-h-[220px] rounded-lg flex flex-col justify-between p-6 animate-pulse border border-gray-50">
			<div className="space-y-4">
				<div className="h-5 bg-gray-200 rounded-md w-3/4"></div>

				<div className="space-y-2">
					<div className="h-3 bg-gray-100 rounded-md w-full"></div>
					<div className="h-3 bg-gray-100 rounded-md w-full"></div>
					<div className="h-3 bg-gray-100 rounded-md w-2/3"></div>
				</div>
			</div>

			<div className="flex justify-between items-center gap-4">
				<div className="h-3 bg-gray-100 rounded-md w-16"></div>
				<div className="h-3 bg-gray-200 rounded-md w-24"></div>
			</div>
		</div>
	);
};

export default ProjectSkeleton;
