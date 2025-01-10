import { auth, currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function Profile() {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  await dbConnect();
  const dbUser = await User.findOne({ clerkId: userId });

  const updateProfile = async (formData: FormData) => {
    'use server'
    const username = formData.get('username') as string;
    const image = formData.get('image') as File;

    if (dbUser) {
      dbUser.username = username;
      if (image.size > 0) {
        // Here you would typically upload the image to a service like Cloudinary
        // and then save the URL. For simplicity, we're just saving the file name.
        dbUser.profileImage = image.name;
      }
      await dbUser.save();
    } else {
      await User.create({
        clerkId: userId,
        username,
        profileImage: image.size > 0 ? image.name : undefined
      });
    }
    redirect('/profile');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form action={updateProfile}>
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input type="text" id="username" name="username" defaultValue={dbUser?.username || user?.username} />
        </div>
        <div className="mb-4">
          <Label htmlFor="image">Profile Image</Label>
          <Input type="file" id="image" name="image" accept="image/*" />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  )
}

