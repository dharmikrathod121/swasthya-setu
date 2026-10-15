"use client";

import { useSearchParams } from "next/navigation";
import { ChatbotChat } from "@/components/chatbot-chat";

export function ChatbotPageInner() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  return <ChatbotChat initialQuery={q} />;
}
