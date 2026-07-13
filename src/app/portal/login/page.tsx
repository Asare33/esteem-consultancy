"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/portal/rentals";
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ mode: "login", email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-muted">
          New customer?{" "}
          <Link href="/portal/register" className="font-semibold text-green">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function PortalLoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer Portal"
        title="Sign In"
        description="Access your rentals, bookings, invoices, and notifications."
      />
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <Suspense fallback={<p className="text-center text-gray-muted">Loading...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
