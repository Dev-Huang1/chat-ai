import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from 'lucide-react'
import { Post } from '../types'

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center mb-2">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={post.author.profileImage} />
            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{post.author.username}</span>
        </div>
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post image" className="mt-2 rounded-md" />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" />
          {post.likes.length}
        </Button>
        <Link href={`/post/${post._id}`}>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments.length}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}