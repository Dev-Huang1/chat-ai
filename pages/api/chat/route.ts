import { NextResponse } from 'next/server'
import axios from 'axios'
// import clientPromise from '@/lib/mongodb'
import { auth } from '@clerk/nextjs'

if (!process.env.CHATGPT_API_URL || !process.env.CHATGPT_API_KEY) {
  throw new Error('Missing ChatGPT API configuration')
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()
  // const client = await clientPromise
  // const db = client.db('chatapp')

  try {
    const response = await axios.post(
      process.env.CHATGPT_API_URL,
      { messages },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`
        }
      }
    )
    const aiMessage = response.data.choices[0].message

    // Store the conversation in MongoDB
    /* await db.collection('conversations').insertOne({
      userId,
      message: messages[messages.length - 1].content,
      response: aiMessage.content,
      timestamp: new Date(),
    }) */

    return NextResponse.json(aiMessage)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Error processing your request', { status: 500 })
  }
}

