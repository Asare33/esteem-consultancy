"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PortalRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "register",
          fullName,
          email,
          phone,
          company,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push("/portal/rentals");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Customer Portal"
        title="Create Account"
        description="Register to track rentals, bookings, invoices, and notifications."
      />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
                <Input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-muted">
                Already registered?{" "}
                <Link href="/portal/login" className="font-semibold text-green">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
