"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Loader2, LogIn } from "lucide-react";
import { getJwtToken, useSession } from "@/lib/auth-client";
import { API_BASE_URL } from "@/lib/constants";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

type BookingModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    studio: {
        _id: string;
        title: string;
        image?: string;
        location?: string;
        hourlyRate: number;
    };
};

const pad = (value: number) => String(value).padStart(2, "0");

/** Local date as YYYY-MM-DD (not UTC) for the date input's min attribute. */
const todayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);

/**
 * Booking dialog launched by "Book Workspace Now". Saves the reservation
 * to the backend `bookings` collection with status "Pending".
 */
const BookingModal = ({ open, onOpenChange, studio }: BookingModalProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session, isPending: sessionPending } = useSession();

    const user = session?.user;
    const today = todayString();

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [hours, setHours] = useState("2");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState<Partial<Record<"date" | "startTime" | "hours", string>>>({});
    const [submitting, setSubmitting] = useState(false);

    const hourCount = Number(hours) || 0;
    const total = studio.hourlyRate * hourCount;

    const validate = () => {
        const next: typeof errors = {};

        if (!date) next.date = "Pick a date for your session";
        else if (date < today) next.date = "The date cannot be in the past";

        if (!startTime) next.startTime = "Pick a start time";
        if (!Number.isFinite(hourCount) || hourCount < 1) next.hours = "Select a duration";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to book this workspace.",
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

        setSubmitting(true);

        try {
            const token = await getJwtToken();

            // POST /add-booking
            // The backend always saves it as "Pending".
            const res = await fetch(
                `${API_BASE_URL}/add-booking`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        studioId: studio._id,
                        studioTitle: studio.title,
                        studioImage: studio.image ?? "",
                        studioLocation: studio.location ?? "",
                        hourlyRate: studio.hourlyRate,
                        userEmail: user.email,
                        userName: user.name ?? "",
                        date,
                        startTime,
                        hours: hourCount,
                        total,
                        notes: notes.trim(),
                        status: "Pending",
                        createdAt: new Date().toISOString(),
                    }),
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok || (data && data.success === false)) {
                throw new Error(
                    data?.message || `The booking API responded with ${res.status}`
                );
            }

            toast({
                title: "Booking requested!",
                description: `"${studio.title}" is reserved — your booking is Pending.`,
                type: "success",
            });

            onOpenChange(false);
            router.push("/my-bookings");
        } catch (error) {
            toast({
                title: "Could not create booking",
                description:
                    error instanceof Error ? error.message : "Please try again later.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Book Workspace Now</DialogTitle>
                    <DialogDescription>
                        {studio.title}
                        {studio.location ? ` · ${studio.location}` : ""} — $
                        {studio.hourlyRate}/hour
                    </DialogDescription>
                </DialogHeader>

                {sessionPending ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Checking your session…
                    </div>
                ) : !user ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Sign in to reserve this workspace by the hour.
                        </p>

                        <Button
                            onClick={() => {
                                onOpenChange(false);
                                router.push("/login");
                            }}
                            className="rounded-full bg-primary text-primary-foreground px-6 font-semibold hover:bg-primary/90"
                        >
                            <LogIn />
                            Sign in to book
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="booking-date">Date</FieldLabel>

                                <Input
                                    id="booking-date"
                                    type="date"
                                    min={today}
                                    value={date}
                                    onChange={(event) => {
                                        setDate(event.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            date: undefined,
                                        }));
                                    }}
                                    aria-invalid={!!errors.date}
                                />

                                {errors.date && <FieldError>{errors.date}</FieldError>}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="booking-time">Start Time</FieldLabel>

                                <Input
                                    id="booking-time"
                                    type="time"
                                    value={startTime}
                                    onChange={(event) => {
                                        setStartTime(event.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            startTime: undefined,
                                        }));
                                    }}
                                    aria-invalid={!!errors.startTime}
                                />

                                {errors.startTime && (
                                    <FieldError>{errors.startTime}</FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="booking-hours">Duration</FieldLabel>

                                <NativeSelect
                                    id="booking-hours"
                                    value={hours}
                                    onChange={(event) => {
                                        setHours(event.target.value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            hours: undefined,
                                        }));
                                    }}
                                    className="w-full"
                                >
                                    {HOURS.map((hour) => (
                                        <NativeSelectOption
                                            key={hour}
                                            value={String(hour)}
                                        >
                                            {hour} {hour === 1 ? "hour" : "hours"}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>

                                {errors.hours && <FieldError>{errors.hours}</FieldError>}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="booking-total">
                                    Estimated Total
                                </FieldLabel>

                                <Input
                                    id="booking-total"
                                    value={`$${total} (${hourCount} × $${studio.hourlyRate})`}
                                    readOnly
                                    disabled
                                />
                            </Field>

                            <Field className="sm:col-span-2">
                                <FieldLabel htmlFor="booking-notes">
                                    Notes{" "}
                                    <span className="text-muted-foreground">
                                        (optional)
                                    </span>
                                </FieldLabel>

                                <Textarea
                                    id="booking-notes"
                                    rows={3}
                                    placeholder="Anything the host should know — equipment, arrival time, guest count…"
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                />
                            </Field>
                        </div>

                        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="size-3.5 shrink-0" />
                            <Clock className="size-3.5 shrink-0" />
                            Bookings start as <strong>Pending</strong> — cancel any time while
                            pending from My Bookings.
                        </p>

                        <DialogFooter className="mt-5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="rounded-full bg-primary text-primary-foreground px-6 font-semibold hover:bg-primary/90"
                            >
                                {submitting && <Loader2 className="animate-spin" />}
                                {submitting ? "Booking..." : "Confirm Booking"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
