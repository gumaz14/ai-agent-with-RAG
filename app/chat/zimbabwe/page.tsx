import { ChatInterface } from "@/components/chat-interface"

export default function ZimbabweChatPage() {
  return (
    <ChatInterface
      apiEndpoint="/api/chat/zimbabwe"
      agentName="Zimbabwe History Scholar"
      agentDescription="Expert on the African Middle Class during colonial Zimbabwe"
      color="amber"
      placeholder="Ask about colonial Zimbabwe history, the African middle class..."
    />
  )
}
