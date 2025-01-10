import mongoose from 'mongoose';

interface PostType extends mongoose.Document {
  likes: mongoose.Types.ObjectId[];
  content: string;
  author: mongoose.Types.ObjectId;
  comments: { content: string, author: mongoose.Types.ObjectId }[];
  image?: string;
}

const PostSchema = new mongoose.Schema({
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ content: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  image: String,
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
