import { zodResolver } from "@hookform/resolvers/zod";
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { inviteMember } from "@/features/members/api/members.api";
import { inviteMemberSchema, type InviteMemberFormData } from "@/features/members/validation";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export default function InviteMemberModal({ isOpen, onClose, projectId }: InviteMemberModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [invitedEmail, setInvitedEmail] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteMemberFormData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
        },
    });

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleClose = () => {
        reset();
        setError(null);
        setIsSuccess(false);
        setIsLoading(false);
        onClose();
    };

    const onSubmit = async (data: InviteMemberFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const appUrl = window.location.origin;
            const baseUrl = import.meta.env.VITE_SUPABASE_URL;

            await inviteMember({
                p_email: data.email,
                p_project_id: projectId,
                p_app_url: appUrl,
                p_base_url: baseUrl,
            });

            setInvitedEmail(data.email);
            setIsSuccess(true);
        } catch (err: unknown) {
            let message = "Failed to send invitation. Please try again.";
            if (err && typeof err === "object") {
                const axiosError = err as { response?: { data?: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    message = axiosError.response.data.message;
                } else if ((err as Error).message) {
                    message = (err as Error).message;
                }
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-dark/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={handleBackdropClick}
            id="invite-member-modal-overlay"
        >
            <div
                className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(4,27,60,0.16)] border border-gray-100 overflow-hidden transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-8 flex flex-col"
                role="dialog"
                aria-modal="true"
                id="invite-member-modal-container"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-medium hover:bg-slate-light/10 hover:text-slate-dark transition-all cursor-pointer z-10"
                    aria-label="Close modal"
                    id="close-invite-modal-btn"
                >
                    <X className="w-5 h-5" />
                </button>

                {isSuccess ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-slate-dark">Invitation Sent</h3>
                            <p className="text-slate-medium text-sm leading-relaxed max-w-sm">
                                We've successfully sent an invitation to <span className="font-semibold text-slate-dark">{invitedEmail}</span> with instructions to join the project.
                            </p>
                        </div>
                        <Button
                            onClick={handleClose}
                            variant="primary"
                            className="w-full mt-4"
                            id="success-done-btn"
                        >
                            Done
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-dark">Invite Member</h2>
                                <p className="text-slate-medium text-xs">Add a new collaborator to this project</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input
                                register={register}
                                name="email"
                                label="Email Address"
                                placeholder="name@example.com"
                                error={errors.email}
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="leading-snug">{error}</span>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-2">
                            <Button
                                onClick={handleClose}
                                type="button"
                                variant="outline"
                                className="flex-1"
                                disabled={isLoading}
                                id="cancel-invite-btn"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1 flex gap-2 items-center"
                                disabled={isLoading}
                                id="submit-invite-btn"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Inviting...</span>
                                    </>
                                ) : (
                                    <span>Send Invite</span>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
