import { PlusCircle } from "lucide-react";
import Button from "@/shared/components/Button";
import EpicsIcon from "@/assets/Epics.svg";

interface EmptyEpicsProps {
	onCreateEpic: () => void;
}

export const EmptyEpics = ({ onCreateEpic }: EmptyEpicsProps) => {
	return (
		<section className="flex flex-col items-center justify-center mt-20 gap-11 animate-in fade-in duration-300">
			<img src={EpicsIcon} alt="No Epics" className="w-50 h-50" />
			<div className="flex flex-col gap-4 justify-center items-center text-center">
				<h2 className="text-2xl font-bold my-2 text-slate-dark">No Epics Found</h2>
				<p className="text-slate-medium max-w-md">
					You don't have any epics yet. Create your first epic to group your project tasks under a broader strategic objective.
				</p>
			</div>
			<Button
				className="cursor-pointer flex gap-3 items-center shadow-md"
				onClick={onCreateEpic}
			>
				<PlusCircle className="w-5 h-5" />
				<span>Create Epic</span>
			</Button>
		</section>
	);
};
