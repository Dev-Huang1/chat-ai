import { ObjectId } from 'mongoose';

export interface PostType {
  _id: ObjectId;
  content: string;
  image?: string;
  likes: ObjectId[];
  comments: { content: string; author: ObjectId }[];
  author: { username: string };
}
