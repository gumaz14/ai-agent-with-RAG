# AI Study Assistants with RAG

A Next.js application featuring specialized AI study assistants powered by Retrieval-Augmented Generation (RAG) and vector search. Each assistant provides expert knowledge in specific domains with real-time source citations.

## Features

- 🤖 **Specialized AI Agents**: Domain-specific assistants with expert knowledge
- 🔍 **Vector Search**: Powered by Vectorize.io for accurate information retrieval
- 📚 **Source Citations**: Every response includes verifiable sources
- 💬 **ChatGPT-style Interface**: Clean, modern chat experience with markdown rendering
- ✨ **Generative UI**: Rich, interactive components for tool execution visualization
- 🎨 **Custom Styling**: Tailwind CSS with responsive design

## Available Assistants

### DMBOK Study Assistant
Expert companion for CDMP certification preparation, covering:
- Data Governance
- Data Quality
- Master Data
- Data Architecture
- Data Modeling
- Metadata Management

### Zimbabwe History Scholar
Specialized in the African middle class during colonial Zimbabwe, covering:
- Colonial Period
- Education & Entrepreneurship
- Land Politics
- Social Mobility
- Nationalism

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI SDK**: Vercel AI SDK with OpenAI
- **Vector Database**: Vectorize.io
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Vectorize.io account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-agent-with-RAG
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Vectorize.io Configuration
VECTORIZE_API_TOKEN=your_vectorize_api_token
VECTORIZE_ORG_ID=your_org_id
VECTORIZE_DMBOK_PIPELINE_ID=your_dmbok_pipeline_id
VECTORIZE_ZIMBABWE_PIPELINE_ID=your_zimbabwe_pipeline_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/chat/          # Chat API endpoints
│   ├── chat/              # Chat page routes
│   └── page.tsx           # Home page
├── components/
│   ├── chat-interface.tsx # Main chat component
│   └── ui/                # UI components
├── lib/
│   ├── vector-db.ts       # Vector database integration
│   └── agent-configs.ts   # Agent configurations
└── .env.local             # Environment variables
```

## Key Features

### Generative UI
The chat interface features rich, interactive components that visualize:
- Real-time search queries
- Source retrieval progress
- Interactive source cards with copy functionality
- Markdown-formatted responses

### Vector Search Integration
- Semantic search using Vectorize.io
- Automatic query optimization
- Top-K retrieval with reranking
- Source metadata preservation

### Custom Markdown Rendering
Built-in markdown renderer supporting:
- Headings (H1-H3)
- Bold and italic text
- Inline code blocks
- Ordered and unordered lists
- Proper spacing and formatting

## Environment Configuration

### Required Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `VECTORIZE_API_TOKEN` | Vectorize.io API token |
| `VECTORIZE_ORG_ID` | Your Vectorize organization ID |
| `VECTORIZE_DMBOK_PIPELINE_ID` | Pipeline ID for DMBOK knowledge base |
| `VECTORIZE_ZIMBABWE_PIPELINE_ID` | Pipeline ID for Zimbabwe history knowledge base |

Get your Vectorize credentials at [https://platform.vectorize.io](https://platform.vectorize.io)

## Development

### Build for Production

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Lint

```bash
npm run lint
```

## Deployment

This project can be deployed on:
- Vercel (recommended)
- Any Node.js hosting platform
- Docker containers

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Vector search by [Vectorize.io](https://vectorize.io/)
- UI components from [Radix UI](https://radix-ui.com/)
