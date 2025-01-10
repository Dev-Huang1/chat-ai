import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/mongodb'
import User from '../../../../../models/User'
import Notification from '../../../../../models/Notification'
import { pusherServer } from '../../../../../lib/pusher'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()

  const currentUser = await User.findOne({ clerkId: userId })
  const userToFollow = await User.findById(params.id)

  if (!userToFollow) {
    return NextResponse.json({
      error: 'User not found'
    }, { status: 404 })
  }

  if (!currentUser.following.includes(userToFollow._id)) {
    currentUser.following.push(userToFollow._id)
    await currentUser.save()

    userToFollow.followers.push(currentUser._id)
    await userToFollow.save()

    // Create a notification
    const notification = new Notification({
      recipient: userToFollow._id,
      sender: currentUser._id,
      type: 'follow'
    })
    await notification.save()

    // Send real-time notification
    await pusherServer.trigger(`private-notifications-${userToFollow._id}`, 'new-notification', notification)
  }

  return NextResponse.json({ message: 'Successfully followed user' })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()

  const currentUser = await User.findOne({ clerkId: userId })
  const userToUnfollow = await User.findById(params.id)

  if (!userToUnfollow) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (currentUser.following.includes(userToUnfollow._id)) {
    currentUser.following = currentUser.following.filter(
      (id: any) => id.toString() !== userToUnfollow._id.toString()
    )
    await currentUser.save()

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id: any) => id.toString() !== currentUser._id.toString()
    )
    await userToUnfollow.save()
  }

  return NextResponse.json({ message: 'Successfully unfollowed user' })
}

