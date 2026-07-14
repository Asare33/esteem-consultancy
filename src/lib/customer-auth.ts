import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { CUSTOMER_COOKIE, getCustomerJwtSecret } from "./auth-constants";

export interface CustomerSession {
  id: number;
  email: string;
  name: string;
  phone: string | null;
}

export async function createCustomerToken(customer: CustomerSession): Promise<string> {
  return new SignJWT({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    typ: "customer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getCustomerJwtSecret());
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const { payload } = await jwtVerify(token, getCustomerJwtSecret());
    if (payload.typ !== "customer") return null;
    return {
      id: payload.id as number,
      email: payload.email as string,
      name: payload.name as string,
      phone: (payload.phone as string | null) ?? null,
    };
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}

export async function setCustomerSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearCustomerSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE);
}

export async function registerCustomer(input: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  company?: string;
}): Promise<CustomerSession | { error: string }> {
  const db = await getDb();
  const email = input.email.toLowerCase().trim();
  const existing = await db.prepare("SELECT id FROM customers WHERE email = ?").get(email);
  if (existing) return { error: "An account with this email already exists" };

  const hash = bcrypt.hashSync(input.password, 12);
  const result = await db
    .prepare(
      `INSERT INTO customers (email, phone, password_hash, full_name, company)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(email, input.phone ?? null, hash, input.fullName.trim(), input.company ?? null);

  return {
    id: Number(result.lastInsertRowid),
    email,
    name: input.fullName.trim(),
    phone: input.phone ?? null,
  };
}

export async function authenticateCustomer(
  email: string,
  password: string
): Promise<CustomerSession | null> {
  const row = (await (await getDb())
    .prepare(
      "SELECT id, email, full_name, phone, password_hash FROM customers WHERE email = ? AND status = 'active'"
    )
    .get(email.toLowerCase().trim())) as
    | {
        id: number;
        email: string;
        full_name: string;
        phone: string | null;
        password_hash: string | null;
      }
    | undefined;

  if (!row?.password_hash || !bcrypt.compareSync(password, row.password_hash)) return null;

  return { id: row.id, email: row.email, name: row.full_name, phone: row.phone };
}

export async function findOrCreateCustomerByContact(input: {
  fullName: string;
  email?: string | null;
  phone: string;
}): Promise<number | null> {
  const db = await getDb();
  if (input.email) {
    const byEmail = (await db
      .prepare("SELECT id FROM customers WHERE email = ?")
      .get(input.email.toLowerCase().trim())) as { id: number } | undefined;
    if (byEmail) return byEmail.id;
  }

  const byPhone = (await db
    .prepare("SELECT id FROM customers WHERE phone = ?")
    .get(input.phone.trim())) as { id: number } | undefined;
  if (byPhone) return byPhone.id;

  if (!input.email) return null;

  const result = await db
    .prepare(
      `INSERT INTO customers (email, phone, full_name, password_hash)
       VALUES (?, ?, ?, NULL)`
    )
    .run(input.email.toLowerCase().trim(), input.phone.trim(), input.fullName.trim());
  return Number(result.lastInsertRowid);
}
