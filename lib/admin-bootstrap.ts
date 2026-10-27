import { eq } from "drizzle-orm";
import { AdminError, type AdminUser } from "./admin";
import { type Db } from "./db";
import { adminGrants, users } from "./db/schema";

/** Operator-only entry point. Never expose this through a route or server action. */
export async function bootstrapFirstAdmin(db: Db, input: unknown): Promise<AdminUser> {
  const email = typeof input === "string" ? input.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AdminError("Oppgi en gyldig e-postadresse.");
  // The initial-admin check and insert share libsql's IMMEDIATE writer lock.
  try {
    return await db.transaction(async (tx) => {
      const [existing] = await tx.select({ userId: adminGrants.userId }).from(adminGrants).limit(1);
      if (existing) throw new AdminError("En administrator finnes allerede. Nye administratorer må legges til fra adminpanelet.");
      const [user] = await tx.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.email, email)).limit(1);
      if (!user) throw new AdminError("Ingen registrert konto har denne e-postadressen.");
      await tx.insert(adminGrants).values({ userId: user.id, grantedBy: null });
      return { ...user, isAdmin: true };
    }, { behavior: "immediate" });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "SQLITE_BUSY") {
      throw new AdminError("En annen databaseoperasjon pågår. Prøv igjen; bare den første administratoren kan opprettes her.");
    }
    throw error;
  }
}
