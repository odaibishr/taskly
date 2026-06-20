import { UserPlus2, Loader2, AlertCircle, CheckCircle2, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { acceptInvitation } from "@/features/members/api/members.api";
import Button from "@/shared/components/Button";
import { ROUTES } from "@/shared/lib/routes";

export default function InvitePage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [acceptedProjectName, setAcceptedProjectName] = useState<string | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (isSuccess) {
            timeoutId = setTimeout(() => {
                if (projectId) {
                    navigate(`/project/${projectId}/tasks`);
                } else {
                    navigate(ROUTES.PROJECTS);
                }
            }, 2500);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isSuccess, projectId, navigate]);

    // 1. If not authenticated, redirect to login page and return back to this page after login.
    if (!user) {
        const redirectPath = window.location.pathname + window.location.search;
        return <Navigate to={`${ROUTES.LOGIN}?redirectTo=${encodeURIComponent(redirectPath)}`} replace />;
    }

    // 2. If token is missing, show an error state
    if (!token) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(4,27,60,0.08)] border border-gray-100 p-8 text-center space-y-6 animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-dark">Invalid Invitation Link</h2>
                        <p className="text-slate-medium text-sm leading-relaxed">
                            No invitation token was found in the URL. Please verify the link in your email and try again.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate(ROUTES.PROJECTS)}
                        variant="primary"
                        className="w-full"
                        id="invalid-link-home-btn"
                    >
                        Go to My Projects
                    </Button>
                </div>
            </div>
        );
    }

    const handleAccept = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await acceptInvitation({ p_token: token }) as { project_id?: string; id?: string; project_name?: string; name?: string } | null;
            
            // Check if the API returned project details (e.g., project_id or name)
            let targetProjectId: string | null = null;
            if (data) {
                if (typeof data === "string") {
                    targetProjectId = data; // Supposing it returns the project UUID as string
                } else if (typeof data === "object") {
                    targetProjectId = data.project_id || data.id || null;
                    if (data.project_name || data.name) {
                        setAcceptedProjectName(data.project_name || data.name || null);
                    }
                }
            }
            
            setProjectId(targetProjectId);
            setIsSuccess(true);

        } catch (err: unknown) {
            let message = "Failed to accept the invitation. The link may be invalid, expired, or you may already be a member of this project.";
            
            if (err && typeof err === "object") {
                const axiosError = err as { response?: { status?: number; data?: { message?: string; error_description?: string } } };
                if (axiosError.response) {
                    const status = axiosError.response.status;
                    if (status === 401) {
                        message = "You are unauthorized. Please sign out and sign in again.";
                    } else if (status === 403) {
                        message = "You do not have permission to accept this invitation.";
                    } else if (axiosError.response.data?.message) {
                        message = axiosError.response.data.message;
                    } else if (axiosError.response.data?.error_description) {
                        message = axiosError.response.data.error_description;
                    }
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
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(4,27,60,0.12)] border border-gray-100 overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
                {isSuccess ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-dark animate-pulse">Invitation Accepted!</h2>
                            <p className="text-slate-medium text-sm leading-relaxed max-w-sm">
                                {acceptedProjectName ? (
                                    <>You have successfully joined <span className="font-semibold text-slate-dark">{acceptedProjectName}</span>.</>
                                ) : (
                                    "You have successfully joined the project."
                                )}
                                <br />
                                <span className="text-xs text-primary font-medium mt-2 block">Redirecting you to the workspace...</span>
                            </p>
                        </div>
                        <div className="w-full pt-4">
                            <Button
                                onClick={() => {
                                    if (projectId) {
                                        navigate(`/project/${projectId}/tasks`);
                                    } else {
                                        navigate(ROUTES.PROJECTS);
                                    }
                                }}
                                variant="primary"
                                className="w-full"
                                id="success-go-to-workspace-btn"
                            >
                                Go to Workspace
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 flex flex-col space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-[#E0E8FF] text-primary rounded-2xl flex items-center justify-center mx-auto shadow-md">
                                <UserPlus2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-1.5">
                                <h2 className="text-2xl font-bold text-slate-dark">Project Invitation</h2>
                                <p className="text-slate-medium text-sm leading-relaxed max-w-xs mx-auto">
                                    You have been invited to collaborate as a team member on a project in Taskly.
                                </p>
                            </div>
                        </div>

                        {/* Info details or warnings */}
                        <div className="bg-[#E0E8FF]/30 rounded-xl p-4 border border-[#E0E8FF]/50 text-xs text-slate-medium leading-relaxed">
                            By accepting, you will gain access to the project's task boards, epics, and member directory. Your profile will be visible to other collaborators.
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span className="leading-snug">{error}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-2">
                            <Button
                                onClick={handleAccept}
                                variant="primary"
                                className="w-full flex items-center justify-center gap-2"
                                disabled={isLoading}
                                id="accept-invite-btn"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Accepting...</span>
                                    </>
                                ) : (
                                    <span>Accept Invitation</span>
                                )}
                            </Button>
                            <Button
                                onClick={() => navigate(ROUTES.PROJECTS)}
                                variant="ghost"
                                className="w-full flex items-center justify-center gap-2 text-slate-medium"
                                disabled={isLoading}
                                id="decline-invite-btn"
                            >
                                <Home className="w-4 h-4" />
                                <span>Go to Dashboard</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
