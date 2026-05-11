
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main className="max-w-7xl mx-auto px-4 pt-24">
                {children}
            </main>
        </>
    )
}