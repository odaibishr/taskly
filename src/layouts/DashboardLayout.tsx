import Navbar from "../shared/components/Navbar";
import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex">

			<Sidebar />

			<div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64 lg:has-[aside.w-20]:ml-20">
				<Navbar />

				<main className="p-6 lg:p-10 flex-1">
					<div className="max-w-[1600px] mx-auto">
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}