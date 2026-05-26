import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import React from "react";

import { useToastStore } from "@/shared/store/toast.store";

export const ToastContainer: React.FC = () => {
	const { toasts, removeToast } = useToastStore();

	return (
		<div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
			{toasts.map((toast) => {
				const isSuccess = toast.type === "success";
				const isError = toast.type === "error";

				return (
					<div
						key={toast.id}
						className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-[0_12px_32px_rgba(4,27,60,0.12)] border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
							isSuccess
								? "bg-emerald-50 border-emerald-100 text-emerald-800"
								: isError
								? "bg-rose-50 border-rose-100 text-rose-800"
								: "bg-blue-50 border-blue-100 text-blue-800"
						}`}
						role="alert"
					>
						<div className="flex items-center gap-3">
							{isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
							{isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
							{!isSuccess && !isError && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
							<span className="text-sm font-semibold">{toast.message}</span>
						</div>
						<button
							onClick={() => removeToast(toast.id)}
							className={`p-1 rounded-lg transition-colors ml-4 cursor-pointer shrink-0 ${
								isSuccess
									? "hover:bg-emerald-100 text-emerald-600"
									: isError
									? "hover:bg-rose-100 text-rose-600"
									: "hover:bg-blue-100 text-blue-600"
							}`}
							aria-label="Close notification"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				);
			})}
		</div>
	);
};
