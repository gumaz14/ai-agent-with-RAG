"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, BookOpen, FileText, ExternalLink, ArrowLeft, Search, Sparkles, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Simple Markdown Renderer Component
function MarkdownRenderer({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    // Split by lines to process
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let listItems: string[] = []
    let listType: 'ul' | 'ol' | null = null

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType
        elements.push(
          <ListTag key={elements.length} className="my-2 ml-4 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm" dangerouslySetInnerHTML={{ __html: processInlineFormatting(item) }} />
            ))}
          </ListTag>
        )
        listItems = []
        listType = null
      }
    }

    const processInlineFormatting = (text: string): string => {
      // Bold
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Code
      text = text.replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
      return text
    }

    lines.forEach((line, idx) => {
      // Headings
      if (line.startsWith('### ')) {
        flushList()
        elements.push(<h3 key={elements.length} className="text-base font-bold mt-4 mb-2 border-b pb-1">{line.slice(4)}</h3>)
      } else if (line.startsWith('## ')) {
        flushList()
        elements.push(<h2 key={elements.length} className="text-lg font-bold mt-4 mb-2 border-b pb-1">{line.slice(3)}</h2>)
      } else if (line.startsWith('# ')) {
        flushList()
        elements.push(<h1 key={elements.length} className="text-xl font-bold mt-4 mb-2 border-b pb-1">{line.slice(2)}</h1>)
      }
      // Unordered list
      else if (line.match(/^[-*]\s/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        listItems.push(line.slice(2))
      }
      // Ordered list
      else if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        listItems.push(line.replace(/^\d+\.\s/, ''))
      }
      // Empty line
      else if (line.trim() === '') {
        flushList()
        if (elements.length > 0 && idx < lines.length - 1) {
          elements.push(<div key={elements.length} className="h-2" />)
        }
      }
      // Regular paragraph
      else {
        flushList()
        elements.push(
          <p key={elements.length} className="text-sm my-1" dangerouslySetInnerHTML={{ __html: processInlineFormatting(line) }} />
        )
      }
    })

    flushList()
    return elements
  }

  return <div className="space-y-1">{renderMarkdown(content)}</div>
}

interface Source {
  id: string
  content: string
  source: string
  title: string
  page?: number
  url?: string
  dataSource?: "vectorize" | "mock"
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
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: apiEndpoint }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  })

  // Auto-scroll the latest user message to the top of viewport
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      // Scroll when a new user message is added
      if (lastMessage.role === 'user') {
        setTimeout(() => {
          const messageElement = document.getElementById(`message-${lastMessage.id}`)
          const viewport = document.querySelector('[data-radix-scroll-area-viewport]')

          if (messageElement && viewport) {
            // Get the position of the message relative to its offset parent
            const messageTop = messageElement.offsetTop
            // Scroll to position the message at the top
            viewport.scrollTo({ top: messageTop, behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status !== "in_progress") {
      sendMessage({ text: input })
      setInput("")
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
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
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
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
              id={`message-${message.id}`}
              className={cn(
                "w-full py-6 px-4",
                message.role === "user" ? "bg-primary/5" : "bg-muted/30"
              )}
            >
              <div className="mx-auto max-w-4xl space-y-3">
                <div className="font-semibold text-sm">
                  {message.role === "user" ? "You" : agentName}
                </div>
                <div className="space-y-3">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <div key={index} className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
                          <MarkdownRenderer content={part.text} />
                        </div>
                      )
                    }

                    // Enhanced tool execution visualization
                    if (part.type === "tool-searchKnowledgeBase" || part.type === "tool-searchHistoricalRecords") {
                      if (part.state === "input-streaming") {
                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              <span className="text-sm text-primary">Preparing search...</span>
                            </div>
                          </div>
                        )
                      }

                      if (part.state === "input-available") {
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-2 border border-primary/20">
                              <Search className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-primary">Searching:</span>
                              <span className="text-sm text-muted-foreground">{part.input.query}</span>
                            </div>
                          </div>
                        )
                      }

                      if (part.state === "output-available" && part.output.state === "complete") {
                        return (
                          <div key={index} className="space-y-2 mt-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Sparkles className="w-3 h-3" />
                              <span>Found {part.output.results.length} relevant sources</span>
                            </div>
                            <div className="grid gap-2">
                              {part.output.results.slice(0, 3).map((result: any, idx: number) => (
                                <Card key={idx} className={cn("p-3 border-l-4", colors.border, "hover:shadow-md transition-shadow")}>
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <FileText className={cn("w-4 h-4", colors.text)} />
                                          <span className="font-semibold text-sm">{result.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{result.content}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => copyToClipboard(result.content, `${message.id}-${idx}`)}
                                      >
                                        {copiedId === `${message.id}-${idx}` ? (
                                          <Check className="w-3 h-3 text-green-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </div>
                                    {result.source && (
                                      <div className="text-xs text-muted-foreground">
                                        {result.source}{result.page ? ` • Page ${result.page}` : ''}
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    }

                    return null
                  })}
                </div>
              </div>
            </div>
          ))}

          {status === "in_progress" && messages[messages.length - 1]?.role === "user" && (
            <div className="w-full py-6 px-4 bg-muted/30">
              <div className="mx-auto max-w-4xl">
                <div className="font-semibold text-sm mb-3">{agentName}</div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={status === "in_progress"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px] max-h-[300px]"
            rows={3}
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
