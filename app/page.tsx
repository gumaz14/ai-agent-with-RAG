import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, History, ArrowRight, Sparkles, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Knowledge Assistants</span>
          </div>
          <h1 className="mb-6 font-bold text-5xl text-balance tracking-tight lg:text-6xl">
            Specialized AI Agents for Deep Learning
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-balance text-muted-foreground leading-relaxed">
            Access expert AI assistants powered by retrieval-augmented generation. Get accurate, sourced answers from
            specialized knowledge bases.
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Database className="h-4 w-4" />
            <span>Powered by vector search and AI SDK</span>
          </div>
        </div>
      </section>

      {/* Agent Cards */}
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {/* DMBOK Agent Card */}
          <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">DMBOK Study Assistant</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Your AI companion for CDMP certification preparation. Get expert guidance on data management concepts,
                DMBOK knowledge areas, and exam preparation strategies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <h4 className="font-medium text-sm">Knowledge Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Data Governance",
                    "Data Quality",
                    "Master Data",
                    "Data Architecture",
                    "Data Modeling",
                    "Metadata",
                  ].map((area) => (
                    <span key={area} className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/chat/dmbok">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 group-hover:shadow-md">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Zimbabwe History Agent Card */}
          <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <History className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Zimbabwe History Scholar</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Expert on the African middle class during colonial Zimbabwe. Explore the social, economic, and political
                dynamics that shaped this pivotal period in history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <h4 className="font-medium text-sm">Topics Covered:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Colonial Period",
                    "Education",
                    "Entrepreneurship",
                    "Land Politics",
                    "Social Mobility",
                    "Nationalism",
                  ].map((topic) => (
                    <span key={topic} className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <Link href="/chat/zimbabwe">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:shadow-md">
                  Explore History
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-bold text-3xl">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="font-bold text-primary">1</span>
                </div>
                <CardTitle className="text-xl">Ask Your Question</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Type your question naturally. The AI agent understands context and can handle complex queries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="font-bold text-primary">2</span>
                </div>
                <CardTitle className="text-xl">Vector Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The agent searches through specialized knowledge bases using semantic vector search for relevant
                  information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <span className="font-bold text-primary">3</span>
                </div>
                <CardTitle className="text-xl">Get Sourced Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receive accurate, streaming responses with citations and sources so you can verify the information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-muted-foreground text-sm">
          <p>Built with Next.js, AI SDK, and Vector Search</p>
        </div>
      </footer>
    </div>
  )
}
