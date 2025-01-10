import { useAuth } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import dbConnect from '../../../lib/mongodb';
import Post from '../../../models/Post';
import User from '../../../models/User';

interface Comment {
  _id: string;
  content: string;
  author: {
    username: string;
  };
}

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { userId } = useAuth();
  if (!userId) {
    notFound();
  }

  await dbConnect();
  const post = await Post.findById(params.id).populate('author').populate('comments.author');
  if (!post) {
    notFound();
  }

  const currentUser = await User.findOne({ clerkId: userId });

  const likePost = async () => {
    'use server'
    if (!post.likes.includes(currentUser._id)) {
      post.likes.push(currentUser._id);
      await post.save();
    }
  };

  const addComment = async (formData: FormData) => {
    'use server'
    const content = formData.get('content') as string;
    post.comments.push({ content, author: currentUser._id });
    await post.save();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.author.username}&apos;s Post</h1>
      <p className="mb-4">{post.content}</p>
      {post.image && <img src={post.image} alt="Post image" className="mb-4" />}
      <Button onClick={likePost}>Like ({post.likes.length})</Button>
      <h2 className="text-xl font-bold mt-4 mb-2">Comments</h2>
      {post.comments.map((comment: Comment) => (
        <div key={comment._id} className="mb-2">
          <strong>{comment.author.username}:</strong> {comment.content}
        </div>
      ))}
      <form action={addComment} className="mt-4">
        <Textarea name="content" placeholder="Add a comment..." className="mb-2" />
        <Button type="submit">Add Comment</Button>
      </form>
    </div>
  );
}
