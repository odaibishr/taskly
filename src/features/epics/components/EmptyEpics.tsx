import { PlusCircle } from "lucide-react";

import EpicsIcon from "@/assets/Epics.svg";
import Button from "@/shared/components/Button";

interface EmptyEpicsProps {
	onCreateEpic: () => void;
	isSearchActive?: boolean;
}

export const EmptyEpics = ({ onCreateEpic, isSearchActive }: EmptyEpicsProps) => {
	const title = isSearchActive 
		? "No epics found matching your search" 
		: "No epics found for this project";

	const description = isSearchActive
		? "We couldn't find any epics that match your search terms. Try searching for something else."
		: "You don't have any epics yet. Create your first epic to group your project tasks under a broader strategic objective.";

	return (
		<section className="flex flex-col items-center justify-center mt-20 gap-11 animate-in fade-in duration-300">
			<img src={EpicsIcon} alt="No Epics" className="w-50 h-50" />
			<div className="flex flex-col gap-4 justify-center items-center text-center">
				<h2 className="text-2xl font-bold my-2 text-slate-dark">{title}</h2>
				<p className="text-slate-medium max-w-md">
					{description}
				</p>
			</div>
			{!isSearchActive && (
				<Button
					className="cursor-pointer flex gap-3 items-center shadow-md"
					onClick={onCreateEpic}
				>
					<PlusCircle className="w-5 h-5" />
					<span>Create Epic</span>
				</Button>
			)}
		</section>
	);
};
