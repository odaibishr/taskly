import { SignUpForm } from "../features/auth/components/SignUpForm";

export default function SignUpPage() {
    return (
        <div className="max-w-md mx-auto p-4">
            <h2 style={{ textAlign: "center" }}>إنشاء حساب جديد</h2>
            <SignUpForm />
        </div>
    );
}
