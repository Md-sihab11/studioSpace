'use client'
import { authClient } from '@/lib/auth-client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            setError("Missing or invalid reset token. Request a new reset link.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const values = Object.fromEntries(formData.entries()) as { password: string; confirmPassword: string };

        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);
        setLoading(true);

        const { error: authError } = await authClient.resetPassword({
            newPassword: values.password,
            token,
        });

        if (authError) {
            setError(authError.message || "Could not reset password. The link may be expired.");
            setLoading(false);
            return;
        }

        router.push("/login");
    };

    if (!token) {
        return (
            <div className="flex flex-col gap-4 px-8 sm:px-10 py-6 bg-white dark:bg-[#171717] text-gray-900 dark:text-white rounded-[25px] transition-colors duration-300">
                <p className="text-center mt-6 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    Reset Password
                </p>
                <p className="text-center text-sm text-red-500 bg-red-50 dark:bg-red-950/40 rounded-md px-3 py-2">
                    This page needs a valid password-reset link.
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 mb-4">
                    <a
                        href="/forgot-password"
                        className="text-gray-900 dark:text-white font-semibold hover:text-green-600 dark:hover:text-[#00ff75] transition-colors"
                    >
                        Request a new link
                    </a>
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 px-8 sm:px-10 py-6 bg-white dark:bg-[#171717] text-gray-900 dark:text-white rounded-[25px] transition-colors duration-300"
        >
            {/* Heading */}
            <p className="text-center mt-6 mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
                Reset Password
            </p>

            {/* Error message */}
            {error && (
                <p className="text-center text-sm text-red-500 -mt-4 bg-red-50 dark:bg-red-950/40 rounded-md px-3 py-2">
                    {error}
                </p>
            )}

            {/* New Password Field */}
            <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>

                <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                    title="Password must contain at least 6 characters, one uppercase and one lowercase letter."
                    className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="New Password"
                    autoComplete="new-password"
                />
            </div>

            {/* Confirm Password Field */}
            <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                >
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>

                <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Confirm New Password"
                    autoComplete="new-password"
                />
            </div>

            {/* Password Instruction */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least 6 characters, including uppercase and lowercase letters.
            </p>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="mt-4 p-3 rounded-[8px] border border-gray-300 dark:border-transparent outline-none transition-all duration-300 bg-gray-200 dark:bg-[#252525] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 mb-4">
                Back to{" "}
                <a
                    href="/login"
                    className="text-gray-900 dark:text-white font-semibold hover:text-green-600 dark:hover:text-[#00ff75] transition-colors"
                >
                    Login
                </a>
            </p>

        </form>
    );
}

const ResetPasswordPage = () => {
    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">

            <div className="w-full max-w-[480px] bg-linear-to-br from-[#00ff75] to-[#3700ff] rounded-[22px] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(0,255,117,0.3)]">

                <div className="rounded-none transition-all duration-200 hover:scale-[0.98] hover:rounded-[20px]">
                    <Suspense fallback={null}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
