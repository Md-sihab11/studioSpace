"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, MapPin, Trash2 } from "lucide-react";
import { getJwtToken, useSession } from "@/lib/auth-client";
import { useToast } from "@/lib/use-toast";
import { AMENITIES, API_BASE_URL, STUDIO_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export type StudioFormValues = {
    title: string;
    category: string;
    hourlyRate: string;
    securityDeposit: string;
    maxCapacity: string;
    location: string;
    image: string;
    images: string[];
    amenities: string[];
    overview: string;
};

const emptyValues: StudioFormValues = {
    title: "",
    category: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    images: [],
    amenities: [],
    overview: "",
};

/** Upload one image to imgbb and return its hosted URL. */
const uploadToImgbb = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error(
            "Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local, or paste an image URL instead."
        );
    }

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
        { method: "POST", body }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success || !data?.data?.url) {
        throw new Error(
            data?.error?.message || "The image host rejected the upload."
        );
    }

    return data.data.url as string;
};

type StudioFormProps = {
    mode: "add" | "edit";
    studioId?: string;
    initialValues?: Partial<StudioFormValues>;
};

const StudioForm = ({
    mode,
    studioId,
    initialValues,
}: StudioFormProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, isPending: sessionPending } = useSession();

    const [values, setValues] = useState<StudioFormValues>({
        ...emptyValues,
        ...initialValues,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof StudioFormValues, string>>
    >({});

    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const user = session?.user;

    // Update form values
    const set = (
        key: keyof StudioFormValues,
        value: string | string[]
    ) => {
        setValues((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: undefined,
        }));
    };

    // Toggle amenities
    const toggleAmenity = (
        amenity: string,
        checked: boolean
    ) => {
        set(
            "amenities",
            checked
                ? [...values.amenities, amenity]
                : values.amenities.filter((a) => a !== amenity)
        );
    };

    // Upload / replace the cover photo.
    const handleCoverUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        setUploading(true);

        try {
            const url = await uploadToImgbb(file);
            set("image", url);
            toast({
                title: "Cover uploaded",
                description: "Your photo is hosted and ready to publish.",
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description:
                    error instanceof Error ? error.message : "Please try again.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    // Upload one or more additional gallery photos.
    const handleGalleryUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        if (files.length === 0) return;

        setUploading(true);

        try {
            const urls = await Promise.all(files.map(uploadToImgbb));

            setValues((prev) => ({
                ...prev,
                images: [...prev.images, ...urls],
                image: prev.image || urls[0] || "",
            }));

            toast({
                title: urls.length > 1 ? "Photos uploaded" : "Photo uploaded",
                description: `${urls.length} gallery image${urls.length === 1 ? "" : "s"} added.`,
                type: "success",
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description:
                    error instanceof Error ? error.message : "Please try again.",
                type: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryImage = (url: string) => {
        set(
            "images",
            values.images.filter((image) => image !== url)
        );
    };

    // Form validation
    const validate = () => {
        const next: typeof errors = {};

        if (!values.title.trim()) {
            next.title = "Title is required";
        }

        if (!values.category) {
            next.category = "Category is required";
        }

        const rate = Number(values.hourlyRate);

        if (
            !values.hourlyRate ||
            !Number.isFinite(rate) ||
            rate <= 0
        ) {
            next.hourlyRate = "Enter an hourly rate greater than 0";
        }

        const deposit = Number(values.securityDeposit || 0);

        if (!Number.isFinite(deposit) || deposit < 0) {
            next.securityDeposit = "Deposit cannot be negative";
        }

        const capacity = Number(values.maxCapacity);

        if (
            !values.maxCapacity ||
            !Number.isFinite(capacity) ||
            capacity < 1
        ) {
            next.maxCapacity = "Capacity must be at least 1";
        }

        if (!values.location.trim()) {
            next.location = "Location is required";
        }

        const cover = values.image.trim() || values.images[0] || "";

        if (!cover) {
            next.image = "Upload a cover photo or paste an image URL";
        } else if (!/^https?:\/\/\S+$/i.test(cover)) {
            next.image = "Enter a valid URL (https://...)";
        }

        if (!values.overview.trim()) {
            next.overview = "Overview is required";
        }

        setErrors(next);

        return Object.keys(next).length === 0;
    };

    // Submit form
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to publish a studio.",
                type: "error",
            });

            router.push("/login");
            return;
        }

        if (!validate()) {
            toast({
                title: "Check the form",
                description: "Please fix the highlighted fields.",
                type: "error",
            });

            return;
        }

        if (mode === "edit" && !studioId) {
            toast({
                title: "Invalid studio",
                description: "Studio ID is missing.",
                type: "error",
            });

            return;
        }

        setSubmitting(true);

        try {
            const token = await getJwtToken();

            const res = await fetch(
                `${API_BASE_URL}/${mode === "add"
                    ? "add-studio"
                    : `update-studio/${studioId}`
                }`,
                {
                    method: mode === "add" ? "POST" : "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...values,
                        image: values.image.trim() || values.images[0] || "",
                        hourlyRate: Number(values.hourlyRate),
                        securityDeposit: Number(values.securityDeposit || 0),
                        maxCapacity: Number(values.maxCapacity),

                        ...(mode === "add"
                            ? {
                                ownerEmail: user.email,
                                ownerName: user.name ?? "",
                                createdAt: new Date().toISOString(),
                                rating: 0,
                                reviews: 0,
                            }
                            : {}),
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok || data?.success === false) {
                throw new Error(
                    data?.message || "Something went wrong"
                );
            }

            toast({
                title:
                    mode === "add"
                        ? "Studio added!"
                        : "Studio updated!",
                description:
                    mode === "add"
                        ? "Your listing is now live on StudioSpace."
                        : "Your changes have been saved.",
                type: "success",
            });

            router.push("/my-listings");
        } catch (error) {
            toast({
                title:
                    mode === "add"
                        ? "Could not add studio"
                        : "Could not update studio",
                description:
                    error instanceof Error
                        ? error.message
                        : "Please try again.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="rounded-3xl border border-gray-200 bg-white ring-0 dark:border-white/10 dark:bg-[#131313]">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {mode === "add"
                        ? "Studio details"
                        : "Edit studio details"}
                </CardTitle>

                <CardDescription>
                    {mode === "add"
                        ? "Fill in the information travelers will see on your listing."
                        : "Update your listing — changes are saved to your studio document."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} noValidate>
                    <FieldGroup className="grid gap-4 sm:grid-cols-2">
                        {/* Title */}
                        <Field>
                            <FieldLabel htmlFor="studio-title">
                                Title
                            </FieldLabel>

                            <Input
                                id="studio-title"
                                placeholder="e.g. Skyline Photo Loft"
                                value={values.title}
                                onChange={(e) =>
                                    set("title", e.target.value)
                                }
                                aria-invalid={!!errors.title}
                            />

                            {errors.title && (
                                <FieldError>
                                    {errors.title}
                                </FieldError>
                            )}
                        </Field>

                        {/* Category */}
                        <Field>
                            <FieldLabel htmlFor="studio-category">
                                Category
                            </FieldLabel>

                            <NativeSelect
                                id="studio-category"
                                value={values.category}
                                onChange={(e) =>
                                    set("category", e.target.value)
                                }
                                aria-invalid={!!errors.category}
                                className="w-full"
                            >
                                <NativeSelectOption value="">
                                    Select a category
                                </NativeSelectOption>

                                {STUDIO_CATEGORIES.map((category) => (
                                    <NativeSelectOption
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>

                            {errors.category && (
                                <FieldError>
                                    {errors.category}
                                </FieldError>
                            )}
                        </Field>

                        {/* Hourly Rate */}
                        <Field>
                            <FieldLabel htmlFor="studio-rate">
                                Hourly Rate ($)
                            </FieldLabel>

                            <Input
                                id="studio-rate"
                                type="number"
                                min={1}
                                step="1"
                                inputMode="decimal"
                                placeholder="45"
                                value={values.hourlyRate}
                                onChange={(e) =>
                                    set("hourlyRate", e.target.value)
                                }
                                aria-invalid={!!errors.hourlyRate}
                            />

                            {errors.hourlyRate && (
                                <FieldError>
                                    {errors.hourlyRate}
                                </FieldError>
                            )}
                        </Field>

                        {/* Security Deposit */}
                        <Field>
                            <FieldLabel htmlFor="studio-deposit">
                                Security Deposit ($)
                            </FieldLabel>

                            <Input
                                id="studio-deposit"
                                type="number"
                                min={0}
                                step="1"
                                inputMode="decimal"
                                placeholder="200"
                                value={values.securityDeposit}
                                onChange={(e) =>
                                    set(
                                        "securityDeposit",
                                        e.target.value
                                    )
                                }
                                aria-invalid={!!errors.securityDeposit}
                            />

                            {errors.securityDeposit && (
                                <FieldError>
                                    {errors.securityDeposit}
                                </FieldError>
                            )}
                        </Field>

                        {/* Max Capacity */}
                        <Field>
                            <FieldLabel htmlFor="studio-capacity">
                                Max Capacity
                            </FieldLabel>

                            <Input
                                id="studio-capacity"
                                type="number"
                                min={1}
                                step="1"
                                inputMode="numeric"
                                placeholder="12"
                                value={values.maxCapacity}
                                onChange={(e) =>
                                    set("maxCapacity", e.target.value)
                                }
                                aria-invalid={!!errors.maxCapacity}
                            />

                            {errors.maxCapacity && (
                                <FieldError>
                                    {errors.maxCapacity}
                                </FieldError>
                            )}
                        </Field>

                        {/* Location */}
                        <Field>
                            <FieldLabel htmlFor="studio-location">
                                Location / Address
                            </FieldLabel>

                            <div className="relative">
                                <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="studio-location"
                                    placeholder="123 Broadway, Brooklyn, NY"
                                    className="pl-8"
                                    value={values.location}
                                    onChange={(e) =>
                                        set("location", e.target.value)
                                    }
                                    aria-invalid={!!errors.location}
                                />
                            </div>

                            {errors.location && (
                                <FieldError>
                                    {errors.location}
                                </FieldError>
                            )}
                        </Field>

                        {/* Cover image */}
                        <Field className="sm:col-span-2">
                            <FieldLabel htmlFor="studio-image">
                                Cover Image
                            </FieldLabel>

                            <div className="flex flex-col gap-3">
                                <Input
                                    id="studio-image"
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={values.image}
                                    onChange={(e) =>
                                        set("image", e.target.value)
                                    }
                                    aria-invalid={!!errors.image}
                                />

                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20">
                                        {uploading ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <ImagePlus className="size-4" />
                                        )}

                                        {uploading
                                            ? "Uploading..."
                                            : "Upload cover photo"}

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverUpload}
                                            disabled={uploading}
                                        />
                                    </label>

                                    <span className="text-xs text-muted-foreground">
                                        or paste a direct HTTPS link above
                                    </span>
                                </div>

                                {values.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={values.image}
                                        alt="Cover preview"
                                        className="h-36 w-full max-w-sm rounded-xl object-cover"
                                    />
                                )}
                            </div>

                            <FieldDescription>
                                Uploaded to imgbb and stored as a hosted URL.
                            </FieldDescription>

                            {errors.image && (
                                <FieldError>
                                    {errors.image}
                                </FieldError>
                            )}
                        </Field>

                        {/* Gallery images */}
                        <Field className="sm:col-span-2">
                            <FieldLabel>Gallery Photos</FieldLabel>

                            <FieldDescription>
                                Optional — add more angles for the details
                                page carousel.
                            </FieldDescription>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-[#131313] dark:text-gray-300 dark:hover:border-sky-400 dark:hover:text-sky-300">
                                    <ImagePlus className="size-4" />
                                    Add gallery photos

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                {values.images.map((url) => (
                                    <span
                                        key={url}
                                        className="relative"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={url}
                                            alt="Gallery preview"
                                            className="size-20 rounded-xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeGalleryImage(url)
                                            }
                                            aria-label="Remove gallery photo"
                                            className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    {/* Amenities */}
                    <Field className="mt-5">
                        <FieldLabel>Amenities</FieldLabel>

                        <FieldDescription>
                            Select everything your studio offers.
                        </FieldDescription>

                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                            {AMENITIES.map((amenity) => (
                                <label
                                    key={amenity}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:border-teal-400 dark:border-white/10 dark:text-gray-300 dark:hover:border-sky-400"
                                >
                                    <Checkbox
                                        checked={values.amenities.includes(
                                            amenity
                                        )}
                                        onCheckedChange={(checked) =>
                                            toggleAmenity(
                                                amenity,
                                                checked === true
                                            )
                                        }
                                    />

                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </Field>

                    {/* Overview */}
                    <Field className="mt-5">
                        <FieldLabel htmlFor="studio-overview">
                            Detailed Overview
                        </FieldLabel>

                        <Textarea
                            id="studio-overview"
                            rows={5}
                            placeholder="Describe the space, lighting, ideal use cases, house rules..."
                            value={values.overview}
                            onChange={(e) =>
                                set("overview", e.target.value)
                            }
                            aria-invalid={!!errors.overview}
                        />

                        {errors.overview && (
                            <FieldError>
                                {errors.overview}
                            </FieldError>
                        )}
                    </Field>

                    {/* Read-only owner */}
                    <FieldGroup className="mt-5 grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="studio-owner-email">
                                User Email
                            </FieldLabel>

                            <Input
                                id="studio-owner-email"
                                value={user?.email ?? ""}
                                readOnly
                                disabled
                                placeholder={
                                    sessionPending ? "Loading..." : "—"
                                }
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="studio-owner-name">
                                User Name
                            </FieldLabel>

                            <Input
                                id="studio-owner-name"
                                value={user?.name ?? ""}
                                readOnly
                                disabled
                                placeholder={
                                    sessionPending ? "Loading..." : "—"
                                }
                            />
                        </Field>
                    </FieldGroup>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() =>
                                router.push("/my-listings")
                            }
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            size="lg"
                            disabled={
                                submitting ||
                                sessionPending ||
                                !user
                            }
                            className="rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98]"
                        >
                            {submitting && (
                                <Loader2 className="animate-spin" />
                            )}

                            {submitting
                                ? mode === "add"
                                    ? "Publishing..."
                                    : "Saving..."
                                : mode === "add"
                                    ? "Publish Studio"
                                    : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default StudioForm;
