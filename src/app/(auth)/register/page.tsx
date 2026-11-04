'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Check,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Loader2,
    Lock,
    Mail,
    User as UserIcon,
    X,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useToast } from '@/lib/use-toast';

const fieldClass =
    "flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-colors focus-within:border-teal-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-400/20 dark:border-white/10 dark:bg-[#0d0d0d] dark:focus-within:border-sky-400 dark:focus-within:bg-[#0d0d0d] dark:focus-within:ring-sky-400/20";

const inputClass =
    "w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500";

const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";

const RegisterPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();

    // Real-time password criteria
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!isPasswordValid) {
            setError(
                "Password must be at least 6 characters and contain uppercase and lowercase letters."
            );
            toast({
                title: "Invalid password",
                description: "Please satisfy all password requirements.",
                type: "error",
            });
            return;
        }

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
            image: user.photoURL?.trim() || undefined,
        });

        if (authError) {
            setError(authError.message || "Could not create account");
            setLoading(false);
            toast({
                title: "Registration failed",
                description: authError.message || "Could not create account",
                type: "error",
            });
            return;
        }

        toast({
            title: "Account created!",
            description: "Welcome to StudioSpace — your account is ready.",
            type: "success",
        });

        router.push("/");
    };

    const requirements = [
        { met: hasMinLength, label: "At least 6 characters" },
        { met: hasUppercase, label: "At least one uppercase letter (A-Z)" },
        { met: hasLowercase, label: "At least one lowercase letter (a-z)" },
    ];

    return (
        <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gray-50 px-4 py-12 transition-colors duration-300 dark:bg-[#0a0a0a] sm:px-6">
            {/* Soft brand glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-linear-to-r from-teal-400/20 via-blue-500/15 to-transparent blur-3xl dark:from-sky-500/15 dark:via-blue-500/10"
            />

            <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-xl shadow-black/[0.04] transition-colors duration-300 dark:border-white/10 dark:bg-[#131313] dark:shadow-black/40 sm:p-9">
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase dark:bg-sky-500/10 dark:text-sky-400">
                        Join StudioSpace
                    </span>

                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Discover inspiring spaces, book them by the hour and
                        list your own studio when you are ready to host.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            >
                                {error}
                            </p>
                        )}

                        <div>
                            <label htmlFor="register-name" className={labelClass}>
                                Full name
                            </label>

                            <div className={fieldClass}>
                                <UserIcon className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />

                                <input
                                    id="register-name"
                                    type="text"
                                    name="name"
                                    required
                                    className={inputClass}
                                    placeholder="Your name"
                                    autoComplete="name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-email" className={labelClass}>
                                Email address
                            </label>

                            <div className={fieldClass}>
                                <Mail className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />

                                <input
                                    id="register-email"
                                    type="email"
                                    name="email"
                                    required
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-photo" className={labelClass}>
                                Photo URL{" "}
                                <span className="font-normal text-gray-400 dark:text-gray-500">
                                    (optional)
                                </span>
                            </label>

                            <div className={fieldClass}>
                                <ImageIcon className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />

                                <input
                                    id="register-photo"
                                    type="url"
                                    name="photoURL"
                                    className={inputClass}
                                    placeholder="https://images.unsplash.com/..."
                                    autoComplete="url"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="register-password" className={labelClass}>
                                Password
                            </label>

                            <div className={fieldClass}>
                                <Lock className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />

                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Dynamic password validation feedback */}
                        <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs dark:border-white/10 dark:bg-[#0d0d0d]">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Password requirements
                            </p>

                            <div className="mt-2 flex flex-col gap-1.5">
                                {requirements.map((requirement) => (
                                    <div
                                        key={requirement.label}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`flex size-4 items-center justify-center rounded-full transition-colors ${
                                                requirement.met
                                                    ? "bg-teal-600 text-white dark:bg-sky-500 dark:text-[#06121a]"
                                                    : "bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-500"
                                            }`}
                                        >
                                            {requirement.met ? (
                                                <Check
                                                    className="size-3"
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <X className="size-2.5" />
                                            )}
                                        </span>

                                        <span
                                            className={`transition-colors ${
                                                requirement.met
                                                    ? "font-medium text-teal-700 dark:text-sky-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {requirement.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-teal-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:from-teal-500 hover:to-blue-500 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && <Loader2 className="size-4 animate-spin" />}
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                        <div className="flex items-center gap-3 py-1">
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                OR
                            </span>
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                authClient.signIn.social({
                                    provider: "google",
                                    callbackURL: "/",
                                })
                            }
                            className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-gray-200 dark:hover:border-white/20 dark:hover:bg-white/5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="size-5"
                                aria-hidden="true"
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

                        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-teal-700 transition-colors hover:text-teal-800 dark:text-sky-400 dark:hover:text-sky-300"
                            >
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
