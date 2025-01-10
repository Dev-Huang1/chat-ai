import mongoose, { Document, Types } from 'mongoose';

export interface UserType extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  username: string;
  profileImage?: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
}

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  profileImage: String,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
