import { cn } from "../lib/utils";


export interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    className?: string;
}

export default function Button({ children, onClick, type = "button", disabled = false, className }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={cn("w-full h-12 bg-linear-to-r from-[#003D9B] to-[#0052CC] shadow-md inline-flex items-center justify-center border-none text-white  cursor-pointer text-[16px] font-bold rounded-sm"
                , disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-linear-to-r hover:from-[#002A75] hover:to-[#003D9B]", className)}>
                { children }
                </button >
    )
            }