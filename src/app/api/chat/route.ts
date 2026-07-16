import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateRoseReply, type ChatMessage } from "@/lib/rose-chat";

export const runtime = "nodejs";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = chatSchema.parse(await request.json());
    const messages = body.messages as ChatMessage[];
    const reply = await generateRoseReply(messages);

    return NextResponse.json({
      reply,
      assistant: "Rose",
      aiEnabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Unable to get a reply right now." }, { status: 500 });
  }
}
