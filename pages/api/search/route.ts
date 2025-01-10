import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Post from '../../../models/Post'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  await dbConnect()

  const posts = await Post.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('author', 'username profileImage')
    .limit(20)

  return NextResponse.json(posts)
}

