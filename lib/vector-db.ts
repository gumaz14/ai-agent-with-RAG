// Mock vector database for DMBOK and Zimbabwe history content
// In production, this would connect to a real vector database like Upstash Vector

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
}

// Mock DMBOK CDMP study materials
const dmbokDocuments: VectorDocument[] = [
  {
    id: "dmbok-1",
    content:
      "Data Management is the development, execution, and supervision of plans, policies, programs, and practices that deliver, control, protect, and enhance the value of data and information assets throughout their lifecycles.",
    metadata: {
      source: "DMBOK Guide",
      title: "Introduction to Data Management",
      page: 12,
    },
  },
  {
    id: "dmbok-2",
    content:
      "The CDMP (Certified Data Management Professional) certification validates knowledge across 11 knowledge areas: Data Governance, Data Architecture, Data Modeling & Design, Data Storage & Operations, Data Security, Data Integration & Interoperability, Documents & Content, Reference & Master Data, Data Warehousing & Business Intelligence, Metadata, and Data Quality.",
    metadata: {
      source: "DMBOK Guide",
      title: "CDMP Certification Overview",
      page: 5,
    },
  },
  {
    id: "dmbok-3",
    content:
      "Data Governance is the exercise of authority and control over the management of data assets. It includes planning, oversight, and control over data management and the use of data and data-related resources.",
    metadata: {
      source: "DMBOK Guide",
      title: "Data Governance Fundamentals",
      page: 45,
    },
  },
  {
    id: "dmbok-4",
    content:
      "Data Quality refers to the degree to which data meets the requirements of its intended use. Key dimensions include accuracy, completeness, consistency, timeliness, validity, and uniqueness.",
    metadata: {
      source: "DMBOK Guide",
      title: "Data Quality Management",
      page: 234,
    },
  },
  {
    id: "dmbok-5",
    content:
      "Master Data Management (MDM) is the control over master data values to enable consistent, shared, contextual use across systems, of the most accurate, timely, and relevant version of truth about essential business entities.",
    metadata: {
      source: "DMBOK Guide",
      title: "Master Data Management",
      page: 189,
    },
  },
]

// Mock Zimbabwe colonial history documents
const zimbabweDocuments: VectorDocument[] = [
  {
    id: "zim-1",
    content:
      "During the colonial period in Zimbabwe (formerly Rhodesia), the African middle class began to emerge in the 1920s and 1930s. This class consisted primarily of teachers, clerks, interpreters, and small-scale traders who had received mission education.",
    metadata: {
      source: "Colonial Zimbabwe: A Social History",
      title: "The Emergence of the African Middle Class",
      page: 78,
      url: "https://example.com/colonial-zimbabwe",
    },
  },
  {
    id: "zim-2",
    content:
      "The Land Apportionment Act of 1930 significantly impacted the African middle class by restricting land ownership and creating separate areas for Europeans and Africans. Despite these restrictions, some educated Africans managed to acquire property in designated urban areas.",
    metadata: {
      source: "Land and Politics in Colonial Zimbabwe",
      title: "Impact of Land Apportionment",
      page: 112,
      url: "https://example.com/land-politics",
    },
  },
  {
    id: "zim-3",
    content:
      "African entrepreneurs in colonial Zimbabwe faced numerous challenges including limited access to capital, discriminatory licensing laws, and competition from established European businesses. However, some succeeded in establishing trading stores, transport services, and small manufacturing enterprises.",
    metadata: {
      source: "African Business in Colonial Zimbabwe",
      title: "Entrepreneurship Under Colonialism",
      page: 45,
      url: "https://example.com/african-business",
    },
  },
  {
    id: "zim-4",
    content:
      "Education played a crucial role in the formation of the African middle class. Mission schools, particularly those run by Methodist, Catholic, and Anglican churches, provided primary and secondary education that enabled Africans to access white-collar employment.",
    metadata: {
      source: "Education and Social Mobility in Zimbabwe",
      title: "Mission Education and Class Formation",
      page: 67,
      url: "https://example.com/education-mobility",
    },
  },
  {
    id: "zim-5",
    content:
      "By the 1960s, the African middle class in Zimbabwe had grown significantly and became increasingly politically active. Organizations like the African National Congress and later ZANU and ZAPU drew much of their leadership from this educated middle class.",
    metadata: {
      source: "Nationalism and Independence in Zimbabwe",
      title: "The Political Awakening",
      page: 134,
      url: "https://example.com/nationalism",
    },
  },
]

// Simple cosine similarity for mock vector search
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

// Mock embedding function (in production, use a real embedding model)
function mockEmbedding(text: string): number[] {
  // Simple hash-based mock embedding
  const embedding = new Array(384).fill(0)
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i)
    embedding[i % 384] += charCode
  }
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / magnitude)
}

// Search function with keyword matching for better mock results
export async function searchVectorDB(
  query: string,
  collection: "dmbok" | "zimbabwe",
  topK = 3,
): Promise<VectorDocument[]> {
  const documents = collection === "dmbok" ? dmbokDocuments : zimbabweDocuments

  // Simple keyword-based scoring for better mock results
  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(" ").filter((word) => word.length > 3)

  const scoredDocs = documents.map((doc) => {
    const contentLower = doc.content.toLowerCase()
    const titleLower = doc.metadata.title.toLowerCase()

    // Calculate keyword match score
    let score = 0
    keywords.forEach((keyword) => {
      if (contentLower.includes(keyword)) score += 2
      if (titleLower.includes(keyword)) score += 3
    })

    // Add some randomness for variety
    score += Math.random() * 0.5

    return { doc, score }
  })

  // Sort by score and return top K
  return scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.doc)
}

// Get all documents for a collection (for reference)
export function getAllDocuments(collection: "dmbok" | "zimbabwe"): VectorDocument[] {
  return collection === "dmbok" ? dmbokDocuments : zimbabweDocuments
}
