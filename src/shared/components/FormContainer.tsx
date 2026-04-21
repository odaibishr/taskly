export default function FormContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-md max-auto p-12 bg-white rounded-lg shadow-[0px_24px_48px_0px_#041B3C0F]">
            {children}
        </div>
    );
}