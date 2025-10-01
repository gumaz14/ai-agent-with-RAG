"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, BookOpen, FileText, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Source {
  id: string
  content: string
  source: string
  title: string
  page?: number
  url?: string
}

interface ChatInterfaceProps {
  apiEndpoint: string
  agentName: string
  agentDescription: string
  color: "blue" | "amber"
  placeholder?: string
}

export function ChatInterface({
  apiEndpoint,
  agentName,
  agentDescription,
  color,
  placeholder = "Ask me anything...",
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [sources, setSources] = useState<Record<string, Source[]>>({})

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: apiEndpoint }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Extract sources from tool calls
  useEffect(() => {
    const newSources: Record<string, Source[]> = {}

    messages.forEach((message) => {
      if (message.role === "assistant") {
        const messageSources: Source[] = []

        message.parts.forEach((part) => {
          if (
            (part.type === "tool-searchKnowledgeBase" || part.type === "tool-searchHistoricalRecords") &&
            part.state === "output-available"
          ) {
            if (part.output.state === "complete" && part.output.results) {
              messageSources.push(...part.output.results)
            }
          }
        })

        if (messageSources.length > 0) {
          newSources[message.id] = messageSources
        }
      }
    })

    setSources(newSources)
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status !== "in_progress") {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      hover: "hover:bg-blue-100",
    },
    amber: {
      gradient: "from-amber-500 to-amber-600",
      text: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      hover: "hover:bg-amber-100",
    },
  }

  const colors = colorClasses[color]

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className={cn("bg-gradient-to-r text-white p-6 shadow-lg", colors.gradient)}>
        <div className="mx-auto max-w-4xl">
          <h1 className="font-bold text-3xl">{agentName}</h1>
          <p className="mt-1 text-white/90">{agentDescription}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <BookOpen className={cn("mx-auto mb-4 w-12 h-12", colors.text)} />
              <h2 className="mb-2 font-semibold text-lg">Start a conversation</h2>
              <p className="text-muted-foreground text-sm">
                Ask me anything about{" "}
                {agentName === "DMBOK Study Assistant"
                  ? "data management and CDMP certification"
                  : "the African middle class in colonial Zimbabwe"}
              </p>
            </Card>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn("max-w-[80%] space-y-2", message.role === "user" ? "order-2" : "order-1")}>
                {/* Message Bubble */}
                <Card
                  className={cn(
                    "p-4",
                    message.role === "user" ? cn("text-white", colors.gradient, "bg-gradient-to-r") : "bg-muted/50",
                  )}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div key={index} className="whitespace-pre-wrap leading-relaxed">
                          {part.text}
                        </div>
                      )
                    }

                    // Show tool execution status
                    if (
                      (part.type === "tool-searchKnowledgeBase" || part.type === "tool-searchHistoricalRecords") &&
                      part.state === "input-available"
                    ) {
                      return (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching knowledge base...</span>
                        </div>
                      )
                    }

                    return null
                  })}
                </Card>

                {/* Sources */}
                {message.role === "assistant" && sources[message.id] && sources[message.id].length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <FileText className="w-3 h-3" />
                      <span>Sources</span>
                    </div>
                    <div className="space-y-2">
                      {sources[message.id].map((source, idx) => (
                        <Card key={idx} className={cn("p-3 text-sm", colors.bg, colors.border)}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{source.title}</span>
                                {source.url && (
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn("hover:underline", colors.text)}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                              <div className="mt-1 text-muted-foreground text-xs">
                                {source.source}
                                {source.page && ` • Page ${source.page}`}
                              </div>
                              <p className="mt-2 text-xs leading-relaxed">{source.content}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {status === "in_progress" && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <Card className="max-w-[80%] bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={status === "in_progress"}
            className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={status === "in_progress" || !input.trim()}
            size="lg"
            className={cn(colors.gradient, "bg-gradient-to-r")}
          >
            {status === "in_progress" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
