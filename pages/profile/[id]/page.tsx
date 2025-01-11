'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import PostCard from '../../../components/PostCard'
import { User, Post } from '../../../types'

export default function UserProfile({ params }: { params: { id: string } }) {
  const { userId } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setIsFollowing(data.followers.includes(userId))
      })

    fetch(`/api/users/${params.id}/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [params.id, userId])

  const handleFollow = async () => {
    const method = isFollowing ? 'DELETE' : 'POST'
    await fetch(`/api/users/${params.id}/follow`, { method })
    setIsFollowing(!isFollowing)
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.profileImage} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p>Followers: {user.followers.length} | Following: {user.following.length}</p>
        </div>
        {userId && userId !== user.clerkId && (
          <Button onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

