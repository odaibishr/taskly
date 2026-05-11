import Button from "../../../shared/components/Button"
import NoProjects from "../../../assets/Abstract.svg"
import { PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const EmptyProjects = () => {
	const navigate = useNavigate()
	return (
		<section className="flex flex-col items-center justify-center mt-20 gap-11">
			<img src={NoProjects} alt="No Projects" className="w-50 h-50" />
			<div className="flex flex-col gap-4 justify-center items-center text-center">
				<h2 className="text-2xl font-bold my-2">No Projects</h2>
				<p className="text-slate-dark">You don’t have any projects yet. Start by defining
					your first architectural workspace to begin tracking tasks and epics.</p>
			</div>
			<Button
				className="cursor-pointer flex gap-3 items-center w-45 shadow-md"
				onClick={() => navigate('/dashboard/create-project')}
			>
				<PlusCircle className="w-5 h-5" />
				<span>Create Project</span>
			</Button>
		</section>
	)
}

export default EmptyProjects