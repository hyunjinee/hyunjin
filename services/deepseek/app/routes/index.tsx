import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Bot, Loader2, MessageSquare, Send, User2 } from "lucide-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Message = {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
};

type MessageWithThinking = Message & {
  finishedThinking?: boolean;
  think?: string;
};

function useMessagesWithThinking(messages: Message[]) {
  return useMemo(
    () =>
      messages.map((m: Message): MessageWithThinking => {
        if (m.role === "assistant") {
          if (m.content.includes("</think>")) {
            return {
              ...m,
              finishedThinking: true,
              think: m.content
                .split("</think>")[0]
                .replace("</think>", "")
                .replace("<think>", ""),
              content: m.content.split("</think>")[1],
            };
          } else {
            return {
              ...m,
              finishedThinking: false,
              think: m.content.replace("<think>", ""),
              content: "",
            };
          }
        }
        return m;
      }),
    [messages]
  );
}

function streamAsyncIterator(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder("utf-8");
  return {
    async *[Symbol.asyncIterator]() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;
          yield decoder.decode(value);
        }
      } finally {
        reader.releaseLock();
      }
    },
  };
}

export const Route = createFileRoute("/")({
  component: AIChat,
});

const chat = createServerFn(
  "POST",
  async ({ messages }: { messages: Message[] }) => {
    return fetch("http://127.0.0.1:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1:32b",
        streaming: true,
        options: {
          temperature: 0.1,
          repeat_penalty: 1.2,
          numa: true, // testing for ARM
        },
        messages: [...messages],
      }),
    });
  }
);

function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [premise, setPremise] = useState("You are a software developer with a focus on React/TypeScript.\rKeep your answer simple and straight forward.");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput("");
    setLoading(true);

    const messagesWithInput: Message[] = [
      ...messages,
      { role: "system", content: premise },
      { role: "user", content: input },
    ];
    setMessages(messagesWithInput);

    const stream = await chat({ messages: messagesWithInput });
    if (stream.body) {
      let assistantResponse = "";
      const reader = stream.body.getReader();
      for await (const value of streamAsyncIterator(reader)) {
        const {
          message: { content },
        } = JSON.parse(value);
        assistantResponse += content;
        setMessages([
          ...messagesWithInput,
          {
            role: "assistant",
            content: assistantResponse,
          },
        ]);
      }
    }
    setLoading(false);
  };

  const messagesWithThinkingSplit = useMessagesWithThinking(messages);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="p-4 container mx-auto max-w-4xl space-y-4">
        <label htmlFor={"premise"}>
          Premise:
          <textarea name={"premise"} style={{ color: "black", padding: "5px 10px", width: "100%" }} value={premise} onChange={(e) => setPremise(e.target.value)} />
        </label>
      </div>
      <div className="flex-1 p-4 container mx-auto max-w-4xl space-y-4 pb-32">
        {messagesWithThinkingSplit
          .filter(({ role }) => role === "user" || role === "assistant")
          .map((m, index) => <AIMessage key={index} message={m} />)}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="flex-1 bg-gray-900 border-gray-700 text-gray-100 pl-10"
                value={input}
                disabled={loading}
                placeholder="Ask your local DeepSeek..."
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const AIMessage: React.FC<{ message: MessageWithThinking }> = ({ message }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
          ? "bg-primary text-black"
          : "bg-gray-800 text-gray-100"
          }`}
      >
        <div className="flex items-center gap-2 mb-2" style={{ justifyContent: "space-between" }}>
          <span className="text-sm font-medium" style={{ display: "flex", gap: 10 }}>
            {message.role === "user" ? (
              <User2 className="h-4 w-4" />
            ) : (
              !message.finishedThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />
            )}

            <span>{message.role === "user" ? "You" : "DeepSeek R1 (32b)"}</span>
          </span>
          <span>
            {message.role === "assistant" && (
              <span
                style={{ cursor: "pointer", fontStyle: "italic", fontSize: "12px" }}
                onClick={() => setCollapsed((c) => !c)}
              >
                {collapsed ? "show thoughts" : "hide thoughts"}
              </span>
            )}
          </span>
        </div>

        {message.role === "assistant" && !message.finishedThinking && (
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        {message.think && (
          <div style={{ display: collapsed ? "none" : "block" }} className="mb-2 text-sm italic border-l-2 border-gray-600 pl-2 py-1 text-gray-300">
            <Markdown>{message.think}</Markdown>
          </div>
        )}
        <article
          className={`prose max-w-none ${message.role === "user"
            ? "prose-invert prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black"
            : "prose-invert prose-p:text-gray-100 prose-headings:text-gray-100 prose-strong:text-gray-100 prose-li:text-gray-100"
            }`}
        >
          <Markdown>{message.content}</Markdown>
        </article>
      </div>
    </div>
  )
}
