'use client'
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';

const ForgotPasswordPage = () => {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries()) as { email: string };

        setLoading(true);
        await authClient.requestPasswordReset({
            email: user.email,
            redirectTo: "/reset-password",
        });
        setLoading(false);
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">

            <div className="w-full max-w-[480px] bg-linear-to-br from-[#00ff75] to-[#3700ff] rounded-[22px] transition-all duration-300 hover:shadow-[0_0_30px_1px_rgba(0,255,117,0.3)]">

                <div className="rounded-none transition-all duration-200 hover:scale-[0.98] hover:rounded-[20px]">

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 px-8 sm:px-10 py-6 bg-white dark:bg-[#171717] text-gray-900 dark:text-white rounded-[25px] transition-colors duration-300"
                    >
                        {/* Heading */}
                        <p className="text-center mt-6 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                            Forgot Password
                        </p>

                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and we&apos;ll send you a link to reset your password.
                        </p>

                        {sent && (
                            <p className="text-center text-sm text-green-600 dark:text-[#00ff75] bg-green-50 dark:bg-[#00ff7515] rounded-md px-3 py-2">
                                If an account exists with that email, a reset link has been sent.
                                (Dev mode: the link is also printed in your terminal.)
                            </p>
                        )}

                        {/* Email Field */}
                        <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                            >
                                <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                            </svg>

                            <input
                                type="email"
                                name="email"
                                required
                                className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                placeholder="Email Address"
                                autoComplete="email"
                                disabled={sent}
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={loading || sent}
                            className="mt-4 p-3 rounded-[8px] border border-gray-300 dark:border-transparent outline-none transition-all duration-300 bg-gray-200 dark:bg-[#252525] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Sending..." : sent ? "Link sent" : "Send Reset Link"}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 mb-4">
                            Remembered it?{" "}
                            <a
                                href="/login"
                                className="text-gray-900 dark:text-white font-semibold hover:text-green-600 dark:hover:text-[#00ff75] transition-colors"
                            >
                                Login
                            </a>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
