import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    department: z.string().min(1, "Department is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});