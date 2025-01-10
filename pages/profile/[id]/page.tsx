'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import PostCard from '../../../components/PostCard'

interface User {
  clerkId: string;
  username: string;
  profileImage: string;
  followers: string[];
  following: string[];
}

interface Post {
  _id: string;
  content: string;
}

export default function UserProfile({ params }: { params: { id: string } }) {
  const { userId } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await fetch(`/api/users/${params.id}`)
      const userData = await userResponse.json()
      setUser(userData)
      setIsFollowing(userData.followers.includes(userId))

      const postsResponse = await fetch(`/api/users/${params.id}/posts`)
      const postsData = await postsResponse.json()
      setPosts(postsData)
    }

    fetchUserData()
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
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
