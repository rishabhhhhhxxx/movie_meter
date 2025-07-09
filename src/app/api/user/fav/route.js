import User from '../../../../lib/models/user.model';
import { connect } from '../../../../lib/mongodb/mongoose';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

export const PUT = async (req) => {
  const user = await currentUser();
  const client = await clerkClient();
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connect();
  const data = await req.json();

  const mongoId = user.publicMetadata.userMongoId;
  console.log('📍 Mongo ID from Clerk metadata:', mongoId);

  const existingUser = await User.findById(mongoId);
  if (!existingUser) {
    console.error('❌ MongoDB user not found for ID:', mongoId);
    return new Response('User not found', { status: 404 });
  }

  const alreadyFav = existingUser.favs.some(fav => fav.movieId === data.movieId);
  const update = alreadyFav
    ? { $pull: { favs: { movieId: data.movieId } } }
    : { $addToSet: { favs: {
        movieId: data.movieId,
        title: data.title,
        description: data.overview,
        dateReleased: data.releaseDate,
        rating: data.voteCount,
        image: data.image,
    } } };

  const updatedUser = await User.findByIdAndUpdate(
    mongoId,
    update,
    { new: true }
  );

  if (!updatedUser) {
    console.error('❌ Failed to update user:', mongoId);
    return new Response('Update failed', { status: 500 });
  }

  const updatedFavs = updatedUser.favs.map(fav => fav.movieId);
  await client.users.updateUserMetadata(user.id, {
    publicMetadata: { favs: updatedFavs },
  });

  return new Response(JSON.stringify(updatedUser), { status: 200 });
};
