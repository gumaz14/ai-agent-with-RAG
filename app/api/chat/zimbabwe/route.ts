import {
  convertToModelMessages,
  type InferUITools,
  streamText,
  tool,
  type UIDataTypes,
  type UIMessage,
  validateUIMessages,
} from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { searchVectorDB } from "@/lib/vector-db"
import { agentConfigs } from "@/lib/agent-configs"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const maxDuration = 30

const searchHistoricalRecordsTool = tool({
  description:
    "Search historical records and documents about the African middle class in Zimbabwe during colonial times. Use this tool to find accurate historical information before answering questions.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant historical information in the knowledge base"),
  }),
  async *execute({ query }: { query: string }) {
    yield { state: "searching" as const, query }

    // Search the vector database
    const results = await searchVectorDB(query, "zimbabwe", 3)

    yield {
      state: "complete" as const,
      results: results.map((doc) => ({
        id: doc.id,
        content: doc.content,
        source: doc.metadata.source,
        title: doc.metadata.title,
        page: doc.metadata.page,
        url: doc.metadata.url,
      })),
    }
  },
})

const tools = {
  searchHistoricalRecords: searchHistoricalRecordsTool,
} as const

export type ZimbabweChatMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>

export async function POST(req: Request) {
  const body = await req.json()

  const messages = await validateUIMessages<ZimbabweChatMessage>({
    messages: body.messages,
    tools,
  })

  const config = agentConfigs.zimbabwe

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: config.systemPrompt,
    messages: convertToModelMessages(messages),
    maxSteps: 5,
    tools,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
