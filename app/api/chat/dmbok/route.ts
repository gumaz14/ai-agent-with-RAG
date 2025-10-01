import {
  convertToModelMessages,
  type InferUITools,
  streamText,
  tool,
  type UIDataTypes,
  type UIMessage,
  validateUIMessages,
} from "ai"
import { z } from "zod"
import { searchVectorDB } from "@/lib/vector-db"
import { agentConfigs } from "@/lib/agent-configs"

export const maxDuration = 30

const searchKnowledgeBaseTool = tool({
  description:
    "Search the DMBOK knowledge base for relevant information about data management concepts, CDMP certification, and related topics. Use this tool to find accurate information before answering questions.",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant information in the knowledge base"),
  }),
  async *execute({ query }: { query: string }) {
    yield { state: "searching" as const, query }

    // Search the vector database
    const results = await searchVectorDB(query, "dmbok", 3)

    yield {
      state: "complete" as const,
      results: results.map((doc) => ({
        id: doc.id,
        content: doc.content,
        source: doc.metadata.source,
        title: doc.metadata.title,
        page: doc.metadata.page,
      })),
    }
  },
})

const tools = {
  searchKnowledgeBase: searchKnowledgeBaseTool,
} as const

export type DmbokChatMessage = UIMessage<never, UIDataTypes, InferUITools<typeof tools>>

export async function POST(req: Request) {
  const body = await req.json()

  const messages = await validateUIMessages<DmbokChatMessage>({
    messages: body.messages,
    tools,
  })

  const config = agentConfigs.dmbok

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: config.systemPrompt,
    messages: convertToModelMessages(messages),
    maxSteps: 5,
    tools,
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
