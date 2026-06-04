import type { TaskStatus } from "./types";

export interface StatusMetadata {
    status: TaskStatus;
    label: string;
    badgeText: string;
    dotColor: string;
    bg: string;
    textClass: string;
}

export const TASK_STATUSES: StatusMetadata[] = [
    {
        status: "TO_DO",
        label: "TO DO",
        badgeText: "TO DO",
        dotColor: "bg-[#3B66F5]",
        bg: "bg-[#F1F3FF]",
        textClass: "text-[#4F5F7B]",
    },
    {
        status: "IN_PROGRESS",
        label: "IN PROGRESS",
        badgeText: "IN PROGRESS",
        dotColor: "bg-[#0052CC]",
        bg: "bg-[#E0ECFF]",
        textClass: "text-[#0052CC]",
    },
    {
        status: "BLOCKED",
        label: "BLOCKED",
        badgeText: "URGENT",
        dotColor: "bg-[#D92D20]",
        bg: "bg-[#FEE4E2]",
        textClass: "text-[#D92D20]",
    },
    {
        status: "IN_REVIEW",
        label: "IN REVIEW",
        badgeText: "IN REVIEW",
        dotColor: "bg-[#B54708]",
        bg: "bg-[#FEF0C7]",
        textClass: "text-[#B54708]",
    },
    {
        status: "READY_FOR_QA",
        label: "READY FOR QA",
        badgeText: "READY FOR QA",
        dotColor: "bg-[#1570EF]",
        bg: "bg-[#EFF8FF]",
        textClass: "text-[#1570EF]",
    },
    {
        status: "REOPENED",
        label: "REOPENED",
        badgeText: "REOPENED",
        dotColor: "bg-[#C11574]",
        bg: "bg-[#FDF2FA]",
        textClass: "text-[#C11574]",
    },
    {
        status: "READY_FOR_PRODUCTION",
        label: "READY FOR PRODUCTION",
        badgeText: "READY PROD",
        dotColor: "bg-[#027A48]",
        bg: "bg-[#ECFDF3]",
        textClass: "text-[#027A48]",
    },
    {
        status: "DONE",
        label: "DONE",
        badgeText: "COMPLETED",
        dotColor: "bg-[#027A48]",
        bg: "bg-[#ECFDF3]",
        textClass: "text-[#027A48]",
    },
];

export const TASK_STATUS_MAP = TASK_STATUSES.reduce(
    (acc, current) => {
        acc[current.status] = current;
        return acc;
    },
    {} as Record<TaskStatus, StatusMetadata>,
);
