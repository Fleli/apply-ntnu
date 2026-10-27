/** Values safe to return to a form. Credentials must never be included. */
export type AccountFormValues = {
  name?: string;
  email?: string;
  phone?: string;
  eventSlug?: string;
};

export type AccountFormState = {
  status: "idle" | "error" | "ok";
  message?: string;
  errors?: Record<string, string>;
  values?: AccountFormValues;
};

export const initialAccountFormState: AccountFormState = { status: "idle" };
export const accountLabel = "block text-sm font-semibold text-ink";
export const accountInput = (error?: string) =>
  `mt-1.5 block w-full rounded-md border bg-surface px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-0 ${
    error
      ? "border-error-focus focus:border-error-focus focus:outline-error-focus/30"
      : "border-line focus:border-brand focus:outline-brand/40"
  }`;
