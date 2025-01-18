import axios from 'axios'
import { CoreMessage } from 'ai'

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const apiUrl = process.env.CHATGPT_API_URL
  const apiKey = process.env.CHATGPT_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Missing environment variables for API URL or API Key')
  }

  const body = {
    model: 'gpt-4o-mini',
    messages: messages,
    system: 'You are a helpful assistant.',
  }

  try {
    const result = await axios.post(apiUrl, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    return new Response(JSON.stringify(result.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching from mirror API:', error)
    throw new Error('Failed to fetch from mirror API')
  }
}
