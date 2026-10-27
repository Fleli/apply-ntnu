import type { AdminUser } from "./admin";

export type AdminFormState = {
  status: "idle" | "error" | "ok";
  message?: string;
  errors?: Record<string, string>;
};

export type MemberLookupState = AdminFormState & { user?: AdminUser };
export const initialAdminFormState: AdminFormState = { status: "idle" };
export const initialMemberLookupState: MemberLookupState = { status: "idle" };
