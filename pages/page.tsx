import { ChatInterface } from '@/components/chat-interface'
import { ThemeToggle } from '@/components/theme-toggle'
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <UserButton afterSignOutUrl="/" />
        <ThemeToggle />
      </div>
      <SignedIn>
        <ChatInterface />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  )
}
