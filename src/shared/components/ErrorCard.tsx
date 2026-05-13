import { CloudOff } from "lucide-react"
import Button from "./Button"

const ErrorCard = ({ retryAction }: { retryAction: () => void }) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300">
			<div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
				<CloudOff className="text-red-500" size={32} />
			</div>
			<h2 className="text-xl font-bold text-[#0F172A] mb-2">
				Something went wrong
			</h2>
			<p className="text-[#64748B] max-w-[320px] mb-8 leading-relaxed">
				We're having trouble retrieving your projects right now. Please try again in a moment.
			</p>
			<Button
				className="bg-[#0052CC] hover:bg-[#003D9B] px-10 py-3 rounded-md shadow-lg shadow-blue-100 transition-all active:scale-95"
				onClick={retryAction}
			>
				Retry Connection
			</Button>
		</div>
	)
}

export default ErrorCard