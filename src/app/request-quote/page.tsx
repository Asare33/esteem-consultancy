"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { services } from "@/data/services";
import { useRentalCart } from "@/context/rental-cart-context";
import { quoteFormSchema, type QuoteFormValues } from "@/lib/schemas";
import { submitForm, formatCartForMessage } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestQuotePage() {
  const router = useRouter();
  const {
    items,
    deliveryLocation,
    pickup,
    clearCart,
    itemsSubtotal,
    deliveryEstimate,
    deliveryBandLabel,
    totalEstimate,
  } = useRentalCart();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { service: items.length > 0 ? "Equipment Rentals" : "" },
  });

  useEffect(() => {
    if (items.length > 0) {
      setValue("service", "Equipment Rentals");
      const cartSummary = formatCartForMessage(items);
      const deliveryNote = deliveryLocation
        ? `\nDelivery: ${deliveryLocation}${pickup ? " (self pickup also requested)" : ""}`
        : pickup
          ? "\nSelf pickup requested"
          : "";
      setValue("message", `Equipment rental quote request.${cartSummary}${deliveryNote}`);
    }
  }, [items, deliveryLocation, pickup, setValue]);

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      const cartSummary = formatCartForMessage(items);
      const result = await submitForm("quote", {
        ...data,
        rentalItems: items.map((c) => ({
          name: c.item.name,
          quantity: c.quantity,
          durationDays: c.durationDays,
          unitPriceGhs: c.item.dailyRateGhs,
          item: c.item,
        })),
        deliveryLocation,
        deliveryEstimate,
        pickup,
        message: data.message + (items.length && !data.message.includes("Rental Items") ? cartSummary : ""),
      });
      if (items.length > 0) clearCart();
      router.push(`/request-quote/confirmation?type=quote&ref=${result.reference}${result.demo ? "&demo=1" : ""}`);
    } catch {
      alert("Something went wrong. Please call us directly or try again.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Request Quote"
        title="Get a Custom Quote"
        description="Share your requirements and receive a tailored proposal within 24–48 hours."
      />
      <section className="py-16">
        <div className="mx-auto max-w-xl px-4 lg:px-8">
          {items.length > 0 && (
            <Card className="mb-6 border-green/30 bg-green/5 shadow-md">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray">Rental Cart</h3>
                  <Badge>{items.length} item type{items.length > 1 ? "s" : ""}</Badge>
                </div>
                <ul className="max-h-48 space-y-2 overflow-y-auto overscroll-contain pr-1 text-sm text-gray-muted">
                  {items.map((c) => (
                    <li key={c.item.id}>
                      {c.item.name} × {c.quantity} ({c.durationDays} day{c.durationDays > 1 ? "s" : ""}) —{" "}
                      <span className="font-medium text-gray">
                        GHS {(c.item.dailyRateGhs * c.quantity * c.durationDays).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
                {deliveryLocation && (
                  <p className="mt-3 text-sm text-gray-muted">Delivery: {deliveryLocation}</p>
                )}
                <div className="mt-3 space-y-1 text-sm">
                  <p className="text-gray-muted">Items subtotal: GHS {itemsSubtotal.toLocaleString()}</p>
                  <p className="text-gray-muted">{deliveryBandLabel}: GHS {deliveryEstimate.toLocaleString()}</p>
                  <p className="font-medium text-gray">Estimated total: GHS {totalEstimate.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input placeholder="Full Name" {...register("name")} aria-label="Full Name" />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Input type="email" placeholder="Email" {...register("email")} aria-label="Email" />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone" {...register("phone")} aria-label="Phone" />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
                <select {...register("service")} aria-label="Service" className="flex h-11 w-full rounded-xl border border-border px-4 text-sm">
                  <option value="">Select Service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
                {errors.service && <p className="text-sm text-red-600">{errors.service.message}</p>}
                <Input placeholder="Estimated Budget (optional)" {...register("budget")} aria-label="Budget" />
                <Textarea placeholder="Describe your requirements..." rows={5} {...register("message")} aria-label="Message" />
                {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-gray-muted">
            Forms run in demo mode until Formspree URLs are added to <code>.env.local</code>
          </p>
        </div>
      </section>
    </>
  );
}
