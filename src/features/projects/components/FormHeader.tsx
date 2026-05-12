import type React from "react"

type FormHeaderProps = {
	title: string,
	description: string,
	icon: React.ReactNode,
}

const FormHeader = ({ title, description, icon }: FormHeaderProps) => {
	return (
		// إزالة الارتفاع الثابت h-[125px] واستخدام min-h مع padding متجاوب
		<div className="min-h-[100px] md:min-h-[125px] px-5 py-6 md:px-8 md:pt-8 md:pb-10 border-b border-surface-low bg-white">
			<div className="flex items-start md:items-center gap-3 md:gap-4">
				{/* منع الأيقونة من الانكماش shrink-0 */}
				<div className="shrink-0 flex items-center justify-center p-2.5 md:p-3 h-10 w-10 md:h-11 md:w-11 bg-primary-container/10 rounded-sm">
					{icon}
				</div>

				<div className="flex flex-col gap-0.5">
					{/* تغيير حجم الخط بناءً على الشاشة */}
					<h1 className="text-xl md:text-2xl font-bold text-slate-dark leading-tight">
						{title}
					</h1>
					<p className="text-sm md:text-body-md text-slate-medium leading-5 max-w-[90%] md:max-w-full">
						{description}
					</p>
				</div>
			</div>
		</div>
	)
}

export default FormHeader
