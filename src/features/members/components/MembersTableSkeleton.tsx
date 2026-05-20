const MembersTableSkeleton = () => {
    return (
        <div className="w-full max-w-full lg:w-255 rounded-xl overflow-hidden mx-auto animate-pulse">
            <div className="overflow-x-auto w-full">
                <table className="w-full min-w-150 text-left border-collapse p-1 bg-surface-low rounded-lg">
                    <thead className="bg-[#E0E8FF4D] h-1/3">
                        <tr className="border-b border-gray-100 bg-[#E0E8FF4D]/30">
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider">
                                Member
                            </th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-medium uppercase tracking-wider text-right md:text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="px-8 py-5 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200/80"></div>
                                    <div className="flex flex-col gap-2">
                                        <div className="h-5 bg-gray-200 rounded-md w-32"></div>
                                        <div className="h-3.5 bg-gray-100 rounded-md w-48"></div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right md:text-left">
                                    <div className="inline-block h-6 bg-gray-200/80 rounded-full w-16"></div>
                                </td>
                                <td className="px-8 py-5 text-right md:text-left">
                                    <div className="inline-block h-8 w-8 bg-gray-100 rounded-lg"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembersTableSkeleton;
