import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticateCustomer,
  createCustomerToken,
  registerCustomer,
  setCustomerSessionCookie,
} from "@/lib/customer-auth";
import { logActivity } from "@/lib/db";

export const runtime = "nodejs";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode = body.mode === "login" ? "login" : "register";

    if (mode === "register") {
      const data = registerSchema.parse(body);
      const result = await registerCustomer(data);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      const token = await createCustomerToken(result);
      await setCustomerSessionCookie(token);
      await logActivity("register", "customer", result.id, result.email);
      return NextResponse.json({ ok: true, customer: result });
    }

    const data = loginSchema.parse(body);
    const customer = await authenticateCustomer(data.email, data.password);
    if (!customer) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = await createCustomerToken(customer);
    await setCustomerSessionCookie(token);
    await logActivity("login", "customer", customer.id, customer.email);
    return NextResponse.json({ ok: true, customer });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
