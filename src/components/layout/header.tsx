"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mainNavigation, ctaNavigation } from "@/data/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-md py-3" : "bg-transparent py-5"
      )}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        <Logo
          textVariant={scrolled ? "default" : "light"}
          priority
          imageClassName="h-14 w-auto max-w-[180px] rounded-none"
        />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNavigation.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDesktopServicesOpen(true)}
                onMouseLeave={() => setDesktopServicesOpen(false)}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    scrolled ? "text-gray hover:text-green" : "text-white/90 hover:text-white"
                  )}
                  aria-haspopup="true"
                  aria-expanded={desktopServicesOpen}
                  onClick={() => setDesktopServicesOpen((prev) => !prev)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div
                  className={cn(
                    "absolute left-0 top-full z-50 mt-1 min-w-[240px] rounded-2xl border border-border bg-background p-2 shadow-xl transition-all",
                    desktopServicesOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-4 py-2.5 text-sm text-gray hover:bg-muted hover:text-green"
                      onClick={() => setDesktopServicesOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  scrolled ? "text-gray hover:text-green" : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/login" aria-label="Admin login">
              <Shield className="mr-1 h-4 w-4" />
              Admin Login
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild variant={scrolled ? "default" : "white"} size="sm">
            <Link href={ctaNavigation.href}>{ctaNavigation.label}</Link>
          </Button>
        </div>

        <button
          className={cn("rounded-lg p-2 lg:hidden", scrolled ? "text-gray" : "text-white")}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-t border-border lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {mainNavigation.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setServicesOpen(!servicesOpen)}
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-medium text-gray"
                      >
                        {item.label}
                        <ChevronDown className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
                      </button>
                      {servicesOpen && (
                        <div className="ml-4 space-y-1 pb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-lg px-4 py-2 text-sm text-gray-muted hover:text-green"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-3 font-medium text-gray hover:bg-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Button asChild className="mt-2 w-full">
                <Link href={ctaNavigation.href} onClick={() => setMobileOpen(false)}>
                  {ctaNavigation.label}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                  <Shield className="mr-1 h-4 w-4" />
                  Admin Login
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
