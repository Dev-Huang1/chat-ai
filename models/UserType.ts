import { Document, Types } from 'mongoose';

export interface UserType extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  username: string;
  profileImage?: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
}
