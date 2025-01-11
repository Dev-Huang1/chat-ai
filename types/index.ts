import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId;
  clerkId: string;
  username: string;
  profileImage?: string;
  following: ObjectId[];
  followers: ObjectId[];
}

export interface Post {
  _id: ObjectId;
  content: string;
  author: User;
  likes: ObjectId[];
  comments: Comment[];
  image?: string;
  createdAt: Date;
}

export interface Comment {
  _id: ObjectId;
  content: string;
  author: User;
  createdAt: Date;
}

export interface Notification {
  _id: ObjectId;
  recipient: ObjectId;
  sender: User;
  type: 'like' | 'comment' | 'follow';
  post?: ObjectId;
  read: boolean;
  createdAt: Date;
}

