import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const consultationFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  service: z.string().min(1),
  date: z.string().min(1),
  package: z.string().min(1),
  budget: z.string().min(1),
  notes: z.string().optional(),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export const quoteFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  service: z.string().min(1),
  budget: z.string().optional(),
  message: z.string().min(10),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
