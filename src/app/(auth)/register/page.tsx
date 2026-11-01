'use client'
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries()) as {
            name: string;
            email: string;
            photoURL?: string;
            password: string;
        };

        const { error: authError } = await authClient.signUp.email({
            email: user.email,
            password: user.password,
            name: user.name,
            image: user.photoURL || undefined,
        });

        if (authError) {
            setError(authError.message || "Could not create account");
            setLoading(false);
            return;
        }

        router.push("/");
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
                        <p className="text-center mt-6 mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
                            Create Account
                        </p>

                        {/* Error message */}
                        {error && (
                            <p className="text-center text-sm text-red-500 -mt-4 bg-red-50 dark:bg-red-950/40 rounded-md px-3 py-2">
                                {error}
                            </p>
                        )}

                        {/* Name Field */}
                        <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z" />
                            </svg>

                            <input
                                type="text"
                                name="name"
                                required
                                className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                placeholder="Full Name"
                                autoComplete="name"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                            >
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-.5a.5.5 0 0 0-.3.9L8 8.9l6.3-4.5a.5.5 0 0 0-.3-.9H2Z" />
                            </svg>

                            <input
                                type="email"
                                name="email"
                                required
                                className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                placeholder="Email Address"
                                autoComplete="email"
                            />
                        </div>

                        {/* Photo URL Field */}
                        <div className="flex items-center gap-3 rounded-[25px] p-4 border-0 outline-none bg-gray-100 dark:bg-[#171717] shadow-[inset_2px_5px_10px_rgba(0,0,0,0.08)] dark:shadow-[inset_2px_5px_10px_rgb(5,5,5)] transition-colors duration-300">

                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-5 w-5 fill-gray-700 dark:fill-white shrink-0"
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1c-2.67 0-5 1.34-5 3v1h10v-1c0-1.66-2.33-3-5-3Z" />
                            </svg>

                            <input
                                type="url"
                                name="photoURL"
                                className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-[#d3d3d3] placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                placeholder="Photo URL (optional)"
                                autoComplete="url"
                            />
                        </div>

                        {/* Password Field */}
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
                                placeholder="Password"
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Password Instruction */}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Password must contain at least 6 characters, including uppercase and lowercase letters.
                        </p>

                        {/* Register Button */}
                        <div className="flex mt-4">

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-3 rounded-[8px] border border-gray-300 dark:border-transparent outline-none transition-all duration-300 bg-gray-200 dark:bg-[#252525] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Register"}
                            </button>

                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-2">
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                        </div>

                        {/* Google Register */}
                        <button
                            type="button"
                            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}
                            className="flex items-center justify-center gap-3 w-full p-3 rounded-[8px] border border-gray-300 dark:border-[#444] bg-gray-100 dark:bg-[#252525] text-gray-900 dark:text-white transition-all duration-300 hover:bg-gray-200 dark:hover:bg-black hover:border-gray-400 dark:hover:border-gray-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="w-5 h-5"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.6 20.5H42V20H24v8h11.3C33.7 35.1 29.3 38 24 38c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.8 1.4 9.3 3.7l5.7-5.7C35.3 4.3 29.9 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.5-.2-2.9-.4-3.5z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="m6.3 14.7 6.6 4.8C14.7 14.8 19 10 24 10c3.6 0 6.8 1.4 9.3 3.7l5.7-5.7C35.3 4.3 29.9 2 24 2 16.1 2 9.3 6.2 6.3 14.7z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 46c5.8 0 11.1-2.2 15.1-5.9l-6.9-5.8C29.8 36 27 38 24 38c-5.3 0-9.7-3.5-11.3-8.3l-6.6 5.1C9.2 41.8 16 46 24 46z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.8l6.9 5.8C42.1 35.7 46 30.3 46 24c0-1.5-.2-2.9-.4-3.5z"
                                />
                            </svg>

                            Continue with Google
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 mb-4">
                            Already have an account?{" "}
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

export default RegisterPage;
