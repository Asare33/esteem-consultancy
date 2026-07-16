"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { ROSE_GREETING, ROSE_QUICK_PROMPTS } from "@/lib/rose-knowledge";
import { siteInfo } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n|\/[a-z0-9\-\/]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gray">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("/")) {
      return (
        <Link key={i} href={part} className="font-medium text-green underline-offset-2 hover:underline">
          {part}
        </Link>
      );
    }
    if (part === "\n") return <br key={i} />;
    return <span key={i}>{part}</span>;
  });
}

export function RoseChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: ROSE_GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to get reply");

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: `I'm having trouble connecting right now. Please call ${siteInfo.contact.phone} or visit /contact for immediate help.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed z-[70] flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl transition-all duration-300 dark:bg-background ${
          open
            ? "bottom-24 left-4 right-4 h-[min(70vh,520px)] md:bottom-24 md:left-6 md:right-auto md:h-[520px] md:w-[380px]"
            : "pointer-events-none bottom-0 h-0 w-0 opacity-0"
        }`}
        role="dialog"
        aria-label="Rose chat assistant"
        aria-hidden={!open}
      >
        <div className="gradient-brand px-4 py-3 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Rose</p>
                <p className="text-xs text-white/85">Esteem Events Assistant</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/90 transition hover:bg-white/15"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "rounded-br-md bg-green text-white"
                    : "rounded-bl-md border border-border bg-white text-gray shadow-sm dark:bg-background"
                }`}
              >
                {message.role === "assistant" ? renderMarkdownLite(message.content) : message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-border bg-white px-3 py-2 text-sm text-gray-muted shadow-sm">
                Rose is typing...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border bg-white p-3 dark:bg-background">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {ROSE_QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => sendMessage(prompt.message)}
                disabled={loading}
                className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-gray transition hover:border-green/30 hover:bg-green/5"
              >
                {prompt.label}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Rose anything..."
              disabled={loading}
              aria-label="Message Rose"
              className="h-10"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-[10px] text-gray-muted">
            Need a person?{" "}
            <a href={`https://wa.me/${siteInfo.contact.whatsapp.replace(/\D/g, "")}`} className="text-green hover:underline">
              Chat on WhatsApp
            </a>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Rose chat" : "Chat with Rose"}
        className={`fixed bottom-40 left-4 z-[65] flex items-center gap-2 rounded-full shadow-lg transition hover:scale-105 hover:shadow-xl md:bottom-6 ${
          open ? "gradient-brand px-4 py-3 text-white" : "gradient-brand h-14 w-14 justify-center text-white"
        }`}
      >
        {open ? (
          <>
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-semibold">Close Rose</span>
          </>
        ) : (
          <Bot className="h-7 w-7" />
        )}
      </button>
    </>
  );
}
