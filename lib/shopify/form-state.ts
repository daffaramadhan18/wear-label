/**
 * The shape a form action answers with.
 *
 * Separate from `./actions` because a `"use server"` module may only export async
 * functions — a type and a constant have to live outside it, and both sides of the
 * boundary need them.
 */
export interface FormNotice {
  status: "idle" | "ok" | "unavailable";
  message: string;
}

export const NO_NOTICE: FormNotice = { status: "idle", message: "" };
