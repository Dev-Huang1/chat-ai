import { CoreMessage, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()


  const apiUrl = process.env.CHATGPT_API_URL
  const apiKey = process.env.CHATGPT_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Missing environment variables for API URL or API Key')
  }

  const body = JSON.stringify({
    model: 'gpt-4o-mini',
    messages: messages,
    system: 'You are a helpful assistant.',
  })

  const result = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: body,
  })

  if (!result.ok) {
    throw new Error('Failed to fetch from mirror API')
  }

  const data = await result.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}

