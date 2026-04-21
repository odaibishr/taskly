import Navbar from "../shared/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4">
                {children}
            </main>
        </>
    )
}