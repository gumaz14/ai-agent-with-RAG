// Shared types for the AI agent application

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
  timestamp: Date
}

export interface Source {
  id: string
  title: string
  content: string
  metadata: {
    source: string
    page?: number
    url?: string
  }
}

export type AgentType = "dmbok" | "zimbabwe"

export interface AgentConfig {
  type: AgentType
  name: string
  description: string
  systemPrompt: string
  color: string
}
