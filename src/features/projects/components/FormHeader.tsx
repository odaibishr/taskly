import type React from "react"

type FormHeaderProps = {
	title: string,
	description: string,
	icon: React.ReactNode,
}

const FormHeader = ({ title, description, icon }: FormHeaderProps) => {
	return (
		<div className="h-[125px] px-8 pt-8 pb-10 border-b border-surface-low">
			<div className="flex items-center gap-4">
				<div className="flex items-center justify-center p-3 h-11 w-11 bg-primary-container/10 rounded-sm">
					{icon}
				</div>
				<div className="flex flex-col gap-0.5">
					<h1 className="text-2xl font-bold text-slate-dark">{title}</h1>
					<p className="text-body-md text-slate-medium leading-5">{description}</p>
				</div>
			</div>

		</div>
	)
}

export default FormHeader