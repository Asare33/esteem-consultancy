export type FormType = "contact" | "quote" | "consultation" | "newsletter";

export interface FormSubmitResult {
  ok: boolean;
  reference: string;
  demo?: boolean;
}

function generateReference(): string {
  return `EMC-${Date.now().toString().slice(-6)}`;
}

function getEndpoint(formType: FormType): string | undefined {
  const map: Record<FormType, string | undefined> = {
    contact: process.env.NEXT_PUBLIC_FORMSPREE_CONTACT,
    quote: process.env.NEXT_PUBLIC_FORMSPREE_QUOTE,
    consultation: process.env.NEXT_PUBLIC_FORMSPREE_CONSULTATION,
    newsletter: process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER,
  };
  return map[formType] ?? process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
}

function saveDemoLead(formType: FormType, data: Record<string, unknown>, reference: string) {
  if (typeof window === "undefined") return;
  const key = `esteem-leads-${formType}`;
  const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
  existing.push({ ...data, reference, submittedAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));
}

async function submitToDatabase(
  formType: FormType,
  data: Record<string, unknown>,
  reference: string
): Promise<boolean> {
  try {
    const rentalItems = data.rentalItems as unknown[] | undefined;
    if (formType === "quote" && rentalItems && rentalItems.length > 0) {
      const cartItems = rentalItems as {
        name?: string;
        item?: { name: string; dailyRateGhs?: number; id?: string };
        quantity: number;
        durationDays: number;
        unitPriceGhs?: number;
      }[];

      const orderRes = await fetch("/api/rental-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: data.name,
          customerPhone: data.phone,
          customerEmail: data.email,
          eventName: data.service ?? "Equipment Rental",
          eventType: "Equipment Rental",
          venue: data.deliveryLocation ?? null,
          transportGhs: typeof data.deliveryEstimate === "number" ? data.deliveryEstimate : 0,
          notes: data.message,
          items: cartItems.map((c) => ({
            itemName: c.name ?? c.item?.name ?? "Equipment",
            quantity: c.quantity,
            unitPriceGhs: c.unitPriceGhs ?? c.item?.dailyRateGhs ?? 0,
            days: c.durationDays || 1,
          })),
        }),
      });

      // Keep legacy rental feed compatible while migrating to parent/child orders.
      await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: data.name,
          contact: data.phone,
          email: data.email,
          notes: data.message,
          reference,
          items: rentalItems,
          deliveryLocation: data.deliveryLocation,
          pickup: data.pickup,
        }),
      });

      return orderRes.ok;
    }

    const eventType =
      formType === "consultation"
        ? String(data.service ?? "Consultation")
        : String(data.service ?? data.event_type ?? "General Enquiry");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        event_type: eventType,
        event_date: data.date ?? null,
        location: data.location ?? null,
        message: data.message ?? data.notes ?? null,
        source: formType,
        reference,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitForm(
  formType: FormType,
  data: Record<string, unknown>
): Promise<FormSubmitResult> {
  const reference = generateReference();
  const endpoint = getEndpoint(formType);

  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...data,
        _form: formType,
        _reference: reference,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to submit form. Please try again or call us directly.");
    }

    await submitToDatabase(formType, data, reference);
    return { ok: true, reference };
  }

  const saved = await submitToDatabase(formType, data, reference);
  if (!saved) {
    saveDemoLead(formType, data, reference);
  }

  return { ok: true, reference, demo: !saved };
}

export function formatCartForMessage(
  items: { item: { name: string }; quantity: number; durationDays: number }[]
): string {
  if (items.length === 0) return "";
  const lines = items.map(
    (c) => `- ${c.item.name} × ${c.quantity} (${c.durationDays} day${c.durationDays > 1 ? "s" : ""})`
  );
  return `\n\nRental Items:\n${lines.join("\n")}`;
}
