import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import User from '../../../models/User';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { content, image } = await req.json();
  const post = await Post.create({
    content,
    image,
    author: user._id
  });

  return NextResponse.json(post);
}

