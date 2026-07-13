"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { services } from "@/data/services";
import { consultationFormSchema, type ConsultationFormValues } from "@/lib/schemas";
import { submitForm } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const steps = ["Contact", "Service & Date", "Package & Budget", "Review"];

const packages = ["Essential", "Professional", "Premium", "Custom"];

export default function BookConsultationPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const form = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: { service: "", package: "", budget: "", date: "" },
  });

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = form;

  const next = async () => {
    const fields: (keyof ConsultationFormValues)[][] = [
      ["name", "email", "phone"],
      ["service", "date"],
      ["package", "budget"],
      [],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = async (data: ConsultationFormValues) => {
    try {
      const result = await submitForm("consultation", data);
      router.push(
        `/request-quote/confirmation?type=consultation&ref=${result.reference}${result.demo ? "&demo=1" : ""}`
      );
    } catch {
      alert("Something went wrong. Please call us directly or try again.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Book Consultation"
        title="Request a Consultation"
        description="Tell us about your needs and we'll schedule a personalised consultation."
      />

      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <div className="mb-8 flex justify-between">
            {steps.map((label, i) => (
              <div key={label} className={`text-center text-xs sm:text-sm ${i <= step ? "text-green font-semibold" : "text-gray-muted"}`}>
                <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm ${i <= step ? "gradient-brand text-white" : "bg-muted text-gray-muted"}`}>
                  {i + 1}
                </div>
                {label}
              </div>
            ))}
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {step === 0 && (
                      <>
                        <Input placeholder="Full Name" {...register("name")} aria-label="Full Name" />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        <Input type="email" placeholder="Email" {...register("email")} aria-label="Email" />
                        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        <Input placeholder="Phone" {...register("phone")} aria-label="Phone" />
                        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <select {...register("service")} aria-label="Service" className="flex h-11 w-full rounded-xl border border-border px-4 text-sm">
                          <option value="">Select Service</option>
                          {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </select>
                        {errors.service && <p className="text-sm text-red-600">{errors.service.message}</p>}
                        <Input type="date" {...register("date")} aria-label="Preferred date" />
                        {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <select {...register("package")} aria-label="Package" className="flex h-11 w-full rounded-xl border border-border px-4 text-sm">
                          <option value="">Select Package</option>
                          {packages.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                        {errors.package && <p className="text-sm text-red-600">{errors.package.message}</p>}
                        <Input placeholder="Estimated Budget (GHS)" {...register("budget")} aria-label="Budget" />
                        {errors.budget && <p className="text-sm text-red-600">{errors.budget.message}</p>}
                        <Textarea placeholder="Additional notes (optional)" {...register("notes")} rows={3} />
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border p-6 text-sm text-gray-muted">
                          <Upload className="h-5 w-5 text-green" />
                          Upload files (brief, inspiration, etc.)
                          <input type="file" className="hidden" multiple aria-label="Upload files" />
                        </label>
                      </>
                    )}
                    {step === 3 && (
                      <div className="space-y-3 rounded-xl bg-muted p-6 text-sm">
                        <h3 className="font-semibold text-gray">Review Your Request</h3>
                        {Object.entries(getValues()).map(([k, v]) => v && (
                          <p key={k}><span className="capitalize text-gray-muted">{k}:</span> {v}</p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-between">
                  <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={next}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">Submit Request</Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
