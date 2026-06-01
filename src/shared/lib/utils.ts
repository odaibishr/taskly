import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1)
        return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

export function formatDueDate(dateString?: string | null): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

export function getAvatarColors(name: string) {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
        { bg: "bg-[#E0ECFF] text-[#0052CC]", border: "border-[#B3D4FF]" },
        { bg: "bg-[#FEF0C7] text-[#B54708]", border: "border-[#FEE4E2]" },
        { bg: "bg-[#EFF8FF] text-[#1570EF]", border: "border-[#D1E9FF]" },
        { bg: "bg-[#ECFDF3] text-[#027A48]", border: "border-[#D1FADF]" },
        { bg: "bg-[#FDF2FA] text-[#C11574]", border: "border-[#FCCEEE]" },
        { bg: "bg-[#F1F3FF] text-[#4F5F7B]", border: "border-[#DAE2FF]" },
    ];
    return colors[hash % colors.length];
}