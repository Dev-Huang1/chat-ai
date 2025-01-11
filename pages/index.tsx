import { ChatInterface } from '@/components/chat-interface'
//import { ThemeToggle } from '@/components/theme-toggle'
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {
  return (
    <ChatInterface />
  )
}
