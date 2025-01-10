import Post from '../models/Post';
import User from '../models/User';

export async function getRecommendedPosts(userId: string) {
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return [];
  }

  // Get posts from users that the current user is following
  const followingPosts = await Post.find({
    author: { $in: user.following }
  }).sort({ createdAt: -1 }).limit(10);

  // Get popular posts (posts with most likes)
  const popularPosts = await Post.aggregate([
    { $addFields: { likesCount: { $size: "$likes" } } },
    { $sort: { likesCount: -1 } },
    { $limit: 5 }
  ]);

  // Combine and shuffle the posts
  const recommendedPosts = [...followingPosts, ...popularPosts];
  return recommendedPosts.sort(() => 0.5 - Math.random());
}

