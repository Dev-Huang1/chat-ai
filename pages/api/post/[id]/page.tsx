import { UserType } from '../../../../models/UserType';
import { PostType } from '../../../../models/PostType';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import dbConnect from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import User from '../../../../models/User';

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

export default function PostPage({ params }: PostPageProps) {
  const { userId } = useAuth();
  const [post, setPost] = useState<PostType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await dbConnect();
      const postData = await Post.findById(params.id).populate('author').populate('comments.author');
      setPost(postData);

      if (userId) {
        const userData = await User.findOne({ clerkId: userId });
        setCurrentUser(userData);
      }
    };
    fetchData();
  }, [userId, params.id]);

  const likePost = async () => {
    if (currentUser && post && !post.likes.includes(currentUser._id)) {
      post.likes.push(currentUser._id);
      await post.save();
      setPost({ ...post });
    }
  };

  const addComment = async (formData: FormData) => {
    if (!currentUser || !post) return;

    const content = formData.get('content') as string;
    post.comments.push({ content, author: currentUser._id });
    await post.save();
    setPost({ ...post });
  };

  if (!post) return <div>Loading...</div>;

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
