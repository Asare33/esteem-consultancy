"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { siteInfo } from "@/data/site";
import { services } from "@/data/services";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";
import { submitForm } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await submitForm("contact", data);
      reset();
      alert(
        result.demo
          ? `Thank you! (Demo mode — saved locally). Reference: ${result.reference}`
          : `Thank you! We'll respond within 24 hours. Reference: ${result.reference}`
      );
    } catch {
      alert("Something went wrong. Please call us directly or try again.");
    }
  };

  const whatsapp = siteInfo.social.find((s) => s.platform === "whatsapp");

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's Start a Conversation"
        description="Reach out for consultations, quotes, or general enquiries. We're here to help."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-gray">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
                <div>
                  <Input placeholder="Full Name" aria-label="Full Name" {...register("name")} />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Input type="email" placeholder="Email" aria-label="Email" {...register("email")} />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone" aria-label="Phone" {...register("phone")} />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <select
                    {...register("service")}
                    aria-label="Service needed"
                    className="flex h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                  {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>}
                </div>
                <div>
                  <Textarea placeholder="Your message" rows={5} aria-label="Message" {...register("message")} />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              {[
                { icon: Phone, label: "Phone", value: siteInfo.contact.phone },
                { icon: Mail, label: "Email", value: siteInfo.contact.email },
                { icon: MapPin, label: "Office", value: `${siteInfo.contact.address}, ${siteInfo.contact.city}` },
                { icon: Clock, label: "Hours", value: siteInfo.contact.businessHours.weekdays },
              ].map((item) => (
                <Card key={item.label} className="border-0 shadow-md">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray">{item.label}</p>
                      <p className="text-sm text-gray-muted">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {whatsapp && (
                <a
                  href={whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-4 font-semibold text-white transition hover:opacity-90"
                >
                  <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="mt-16 overflow-hidden rounded-2xl shadow-lg">
            <iframe
              title="Office location map"
              src={siteInfo.contact.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
