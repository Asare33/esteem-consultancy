import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { ADMIN_COOKIE, COOKIE_NAME, getJwtSecret } from "./auth-constants";

export interface AdminSession {
  id: number;
  email: string;
  name: string;
  roleKey?: string | null;
}

export async function createToken(admin: AdminSession): Promise<string> {
  return new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    roleKey: admin.roleKey ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      roleKey: (payload.roleKey as string | null | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value ?? cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export function authenticateAdmin(email: string, password: string): AdminSession | null {
  const db = getDb();
  const normalized = email.toLowerCase().trim();

  const staff = db
    .prepare(
      `SELECT id, email, name, password_hash, role_key
       FROM staff_users WHERE lower(email) = ? AND active = 1`
    )
    .get(normalized) as
    | { id: number; email: string; name: string; password_hash: string; role_key: string }
    | undefined;

  if (staff && bcrypt.compareSync(password, staff.password_hash)) {
    return {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      roleKey: staff.role_key,
    };
  }

  const row = db
    .prepare("SELECT id, email, name, password_hash FROM admins WHERE email = ?")
    .get(normalized) as
    | { id: number; email: string; name: string; password_hash: string }
    | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) return null;

  // Legacy admins table users get full access
  return { id: row.id, email: row.email, name: row.name, roleKey: null };
}

export { COOKIE_NAME } from "./auth-constants";
