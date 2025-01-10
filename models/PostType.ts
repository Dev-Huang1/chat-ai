import mongoose from 'mongoose';

export interface PostType {
  _id: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  likes: mongoose.Types.ObjectId[];
  comments: { content: string; author: mongoose.Types.ObjectId }[];
  author: { username: string };
}
