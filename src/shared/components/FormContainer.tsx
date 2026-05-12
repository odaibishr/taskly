import { cn } from "../lib/utils";

export default function FormContainer({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("max-w-md max-auto p-12 bg-white rounded-lg shadow-[0px_24px_48px_0px_#041B3C0F]", className)}>
            {children}
        </div>
    );
}