// Account signup shares its action state with login and profile editing.
export type {
  AccountFormState as SignupState,
  AccountFormValues as SignupValues,
} from "@/lib/account-forms";
export type SignupErrors = Record<string, string>;
