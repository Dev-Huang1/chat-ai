'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import PostCard from '../components/PostCard'
import { pusherClient } from '../lib/pusher'
import { useInView } from 'react-intersection-observer'
import Notifications from '../components/Notifications'

export default function Home() {
  const { userId } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  const fetchPosts = useCallback(async () => {
    const res = await fetch(`/api/posts?page=${page}`)
    const data = await res.json()
    setPosts(prevPosts => [...prevPosts, ...data])
    setHasMore(data.length === 10)
    setPage(prevPage => prevPage + 1)
  }, [page])

  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts()
    }
  }, [inView, hasMore, fetchPosts])

  useEffect(() => {
    fetchPosts()

    const channel = pusherClient.subscribe('posts')
    channel.bind('new-post', (newPost: any) => {
      setPosts(prevPosts => [newPost, ...prevPosts])
    })

    return () => {
      pusherClient.unsubscribe('posts')
    }
  }, [fetchPosts])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Social Media App</h1>
      {userId ? (
        <>
          <div className="flex gap-2 mb-4">
            <Link href="/profile">
              <Button>Profile</Button>
            </Link>
            <Link href="/search">
              <Button>Search</Button>
            </Link>
            <Notifications />
          </div>
          <div className="space-y-4">
            {posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
            {hasMore && <div ref={ref}>Loading more...</div>}
          </div>
        </>
      ) : (
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      )}
    </div>
  )
}
