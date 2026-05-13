import { cn } from "../lib/utils";

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
}

const variants = {
    primary: "bg-linear-to-r from-[#003D9B] to-[#0052CC] text-white hover:from-[#002A75] hover:to-[#003D9B] shadow-md",
    secondary: "bg-surface-highest text-primary hover:bg-surface-highest/80",
    outline: "border-1 border-primary text-primary hover:bg-primary/5",
    ghost: "text-slate-medium hover:bg-slate-light/10 hover:text-slate-dark",
};

export default function Button({ children, onClick, type = "button", disabled = false, className, variant = "primary" }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={cn(
                "inline-flex items-center justify-center cursor-pointer text-[16px] font-bold rounded-sm transition-all duration-200 h-12 px-6",
                variants[variant],
                disabled && "opacity-50 cursor-not-allowed grayscale",
                className
            )}
        >
            {children}
        </button >
    )
}
