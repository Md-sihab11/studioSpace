"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Aperture,
    ArrowRight,
    CalendarClock,
    Camera,
    LayoutDashboard,
    LogOut,
    Mail,
    Plus,
    ShieldCheck,
    User as UserIcon,
    X,
} from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayoutShell from "@/component/dashboard/DashboardLayoutShell";
import RequireAuth from "@/component/auth/RequireAuth";

const ProfilePage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, isPending } = useSession();
    const user = session?.user;

    const [avatarUrl, setAvatarUrl] = useState<string>(""); // for URL input
    const [avatarFile, setAvatarFile] = useState<File | null>(null); // for file upload
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // preview
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const currentAvatar = user?.image ?? null;

    const handleSignOut = async () => {
        try {
            await authClient.signOut();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
                type: "info",
            });
            router.push("/login");
        } catch {
            toast({
                title: "Logout failed",
                description: "Please try again.",
                type: "error",
            });
        }
    };

    const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarUrl(e.target.value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast({ title: "Invalid file", description: "Please select an image file.", type: "error" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "File too large", description: "Maximum size is 5MB.", type: "error" });
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
            setAvatarUrl(""); // clear URL input
        }
    };

    const saveAvatar = async () => {
        const imageToSave = avatarPreview || avatarUrl.trim();
        if (!imageToSave) {
            toast({ title: "No image", description: "Provide a URL or upload an image.", type: "error" });
            return;
        }

        setIsUploading(true);
        try {
            // Use better-auth's built-in updateUser method
            const { error } = await authClient.updateUser({ image: imageToSave });

            if (error) {
                throw new Error(error.message ?? "Failed to update avatar");
            }

            toast({ title: "Profile picture updated", description: "Your new avatar is live.", type: "success" });
            setIsEditingAvatar(false);
            setAvatarUrl("");
            setAvatarFile(null);
            setAvatarPreview(null);
            router.refresh(); // refresh session to get new image
        } catch (err) {
            console.error(err);
            toast({ title: "Update failed", description: err instanceof Error ? err.message : "Could not save avatar", type: "error" });
        } finally {
            setIsUploading(false);
        }
    };

    const cancelAvatarEdit = () => {
        setIsEditingAvatar(false);
        setAvatarUrl("");
        setAvatarFile(null);
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
    };

    // 1. Loading State
    if (isPending) {
        return (
            <DashboardLayoutShell>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                        <Skeleton className="size-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <Skeleton className="h-44 w-full rounded-2xl" />
                        <Skeleton className="h-44 w-full rounded-2xl" />
                    </div>
                </div>
            </DashboardLayoutShell>
        );
    }

    // 2. Unauthenticated State
    if (!user) {
        return (
            <DashboardLayoutShell>
                <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <UserIcon className="size-8" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                        Sign in to view your profile
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your profile information, listings, and bookings are tied to your account.
                    </p>
                    <div className="mt-6 flex w-full gap-3">
                        <Link href="/login" className="flex-1">
                            <Button className="w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                            <Button variant="outline" className="w-full rounded-full">
                                Register
                            </Button>
                        </Link>
                    </div>
                </div>
            </DashboardLayoutShell>
        );
    }

    const userName = user.name || user.email?.split("@")[0] || "StudioSpace User";
    const initials = userName
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const displayAvatar = isEditingAvatar ? (avatarPreview || avatarUrl || currentAvatar) : currentAvatar;

    return (
        <DashboardLayoutShell>
            <div className="flex flex-col gap-8">
                {/* Profile Header */}
                <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        {displayAvatar ? (
                            <img
                                src={displayAvatar}
                                alt={userName}
                                className="size-20 rounded-full border-2 border-primary/20 object-cover shadow-sm sm:size-24"
                            />
                        ) : (
                            <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-teal-600 to-blue-600 text-2xl font-bold text-white shadow-md sm:size-24">
                                {initials || <UserIcon className="size-10" />}
                            </div>
                        )}
                        {!isEditingAvatar && (
                            <button
                                type="button"
                                onClick={() => setIsEditingAvatar(true)}
                                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                                aria-label="Change profile picture"
                            >
                                <Camera className="size-4" />
                            </button>
                        )}
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {userName}
                            </h1>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#B7F36B] px-2.5 py-0.5 text-xs font-bold text-black">
                                <ShieldCheck className="size-3.5" />
                                Verified Member
                            </span>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="size-4 shrink-0" />
                            {user.email}
                        </p>
                    </div>
                </div>

                {isEditingAvatar ? (
                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <Button onClick={saveAvatar} disabled={isUploading} className="rounded-full" size="sm">
                            {isUploading ? "Saving..." : "Save"}
                        </Button>
                        <Button variant="ghost" onClick={cancelAvatarEdit} className="rounded-full" size="sm">
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full sm:w-auto rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                        <LogOut className="size-4" />
                        Sign out
                    </Button>
                )}
            </div>

            {/* Avatar Edit Modal/Section */}
            {isEditingAvatar && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Update Profile Picture</h3>
                        <button onClick={cancelAvatarEdit} className="text-muted-foreground hover:text-foreground" aria-label="Close">
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="flex justify-center mb-6">
                        <div className="relative size-24 sm:size-28">
                            {avatarPreview || avatarUrl ? (
                                <img
                                    src={avatarPreview || avatarUrl}
                                    alt="Preview"
                                    className="size-full rounded-full border-2 border-primary/20 object-cover"
                                />
                            ) : currentAvatar ? (
                                <img
                                    src={currentAvatar}
                                    alt="Current"
                                    className="size-full rounded-full border-2 border-primary/20 object-cover opacity-50"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-teal-600 to-blue-600 text-3xl font-bold text-white">
                                    {initials || <UserIcon className="size-12" />}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="avatar-url" className="block text-sm font-medium mb-2">
                                Image URL
                            </Label>
                            <Input
                                id="avatar-url"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={avatarUrl}
                                onChange={handleAvatarUrlChange}
                                className="w-full"
                                disabled={!!avatarFile}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Paste a direct link to an image (jpg, png, webp)</p>
                        </div>

                        <div className="relative">
                            <Label htmlFor="avatar-upload" className="block text-sm font-medium mb-2">
                                Or upload an image
                            </Label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
                                disabled={!!avatarUrl}
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                <Camera className="size-8 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">Drag & drop or click to upload</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
                                </div>
                                {avatarFile && (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                        ✓ {avatarFile.name} ({(avatarFile.size / 1024).toFixed(1)} KB)
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={cancelAvatarEdit} className="rounded-full">
                            Cancel
                        </Button>
                        <Button onClick={saveAvatar} disabled={isUploading} className="rounded-full">
                            {isUploading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Account Details & Role */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-bold">
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your verified identity across the marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 space-y-3 p-0 text-sm">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Display Name</span>
                            <span className="font-semibold text-foreground">{userName}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Email Address</span>
                            <span className="font-semibold text-foreground truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Account Status</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active &amp; Verified</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-muted-foreground">Protection Tier</span>
                            <span className="font-semibold text-foreground">$3M Host &amp; Guest Guarantee</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card p-6">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg font-bold">
                            Quick Actions
                        </CardTitle>
                        <CardDescription>
                            Jump directly into your creative workflows.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4 flex flex-col gap-2.5 p-0">
                        <Link href="/add-studio">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <Plus className="size-4 text-teal-600 dark:text-sky-400" />
                                    Add New Studio
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/my-listings">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <Aperture className="size-4 text-blue-600 dark:text-blue-400" />
                                    My Studio Listings
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/my-bookings">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <CalendarClock className="size-4 text-purple-600 dark:text-purple-400" />
                                    My Bookings
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <LayoutDashboard className="size-4 text-amber-600 dark:text-amber-400" />
                                    Creator Dashboard
                                </span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
            </div>
        </DashboardLayoutShell>
    );
};

const ProfilePageWithAuth = () => (
    <RequireAuth>
        <ProfilePage />
    </RequireAuth>
);

export default ProfilePageWithAuth;
