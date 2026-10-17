import type { RegistrationStatus } from "@/lib/db/schema";

export const years = ["1. år", "2. år", "3. år", "4. år", "5. år", "Annet"] as const;

export type SignupValues = {
  firstName: string;
  lastName: string;
  email: string;
  studyProgram: string;
  year: string;
  eventSlug: string;
};

export type SignupErrors = Partial<Record<keyof SignupValues | "consent", string>>;

export type SignupState =
  | { status: "idle" }
  | { status: "error"; message?: string; errors: SignupErrors; values: SignupValues }
  | {
      status: "ok";
      firstName: string;
      registration?: { status: RegistrationStatus; eventTitle: string };
    };
