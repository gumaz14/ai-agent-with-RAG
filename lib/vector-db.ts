// Vectorize.io vector database integration for production RAG

export interface VectorDocument {
  id: string
  content: string
  metadata: {
    source: string
    title: string
    page?: number
    url?: string
  }
  embedding?: number[]
  dataSource?: "vectorize" | "mock" // Track whether data came from Vectorize API or mock fallback
}

// Vectorize API configuration
const VECTORIZE_API_TOKEN = process.env.VECTORIZE_API_TOKEN
const VECTORIZE_ORG_ID = process.env.VECTORIZE_ORG_ID

// Pipeline IDs for different collections
const PIPELINE_IDS = {
  dmbok: process.env.VECTORIZE_DMBOK_PIPELINE_ID,
  zimbabwe: process.env.VECTORIZE_ZIMBABWE_PIPELINE_ID,
} as const

// Search function using Vectorize.io API only (no fallback)
export async function searchVectorDB(
  query: string,
  collection: "dmbok" | "zimbabwe",
  topK = 3,
): Promise<VectorDocument[]> {
  // Check if Vectorize is configured
  const pipelineId = PIPELINE_IDS[collection]
  const isConfigured = VECTORIZE_API_TOKEN && VECTORIZE_ORG_ID && pipelineId

  if (!isConfigured) {
    const missingVars = []
    if (!VECTORIZE_API_TOKEN) missingVars.push("VECTORIZE_API_TOKEN")
    if (!VECTORIZE_ORG_ID) missingVars.push("VECTORIZE_ORG_ID")
    if (!pipelineId) missingVars.push(`VECTORIZE_${collection.toUpperCase()}_PIPELINE_ID`)

    throw new Error(
      `Vectorize is not configured. Missing environment variables: ${missingVars.join(", ")}. ` +
        `Please set these in .env.local file. Get your credentials from https://platform.vectorize.io`,
    )
  }

  // Call Vectorize retrieval API with the correct endpoint format
  const url = `https://api.vectorize.io/v1/org/${VECTORIZE_ORG_ID}/pipelines/${pipelineId}/retrieval`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VECTORIZE_API_TOKEN}`,
    },
    body: JSON.stringify({
      question: query,
      numResults: topK,
      rerank: true,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Vectorize API error: ${response.status} ${response.statusText}. ` +
        `Response: ${errorText}. Please check your API credentials and pipeline configuration.`,
    )
  }

  const data = await response.json()

  const results: VectorDocument[] = (data.results || data.documents || []).map((doc: any, idx: number) => ({
    id: doc.id || `${collection}-${idx}`,
    content: doc.text || doc.content || "",
    metadata: {
      source: doc.metadata?.source || doc.source || "Vectorize Database",
      title: doc.metadata?.title || doc.title || "Untitled",
      page: doc.metadata?.page || doc.page,
      url: doc.metadata?.url || doc.url,
    },
    dataSource: "vectorize" as const,
  }))

  return results
}

