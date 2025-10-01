import { ChatInterface } from "@/components/chat-interface"

export default function DmbokChatPage() {
  return (
    <ChatInterface
      apiEndpoint="/api/chat/dmbok"
      agentName="DMBOK Study Assistant"
      agentDescription="Your AI companion for CDMP certification preparation"
      color="blue"
      placeholder="Ask about data management, DMBOK, or CDMP certification..."
    />
  )
}
