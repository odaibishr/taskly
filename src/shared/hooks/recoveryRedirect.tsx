import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRecoveryRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes("type=recovery")) {
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get("access_token");
            if (token) {
                navigate(`/reset-password?access_token=${token}`, { replace: true });
                localStorage.setItem('access_token', token);
            }
        }
    }, [navigate]);
}