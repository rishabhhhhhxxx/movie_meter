// import AddToFav from '@/components/AddToFav';
// import Link from 'next/link';

// export default async function MoviePage({ params }) {
//   const { id: movieId } = await params;
//   const res = await fetch(
//     `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`
//   );
//   const movie = await res.json();

//   if (!res.ok) {
//     return (
//       <div className='text-center mt-10'>
//         <h1 className='text-xl my-5'>
//           Movie details are not available at the moment!
//         </h1>
//         {/* return home */}
//         <p>
//           <Link href='/' className='hover:text-amber-600'>
//             Go Home
//           </Link>
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className='w-full'>
//       <div className='p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6'>
//         <img
//           src={`https://image.tmdb.org/t/p/original/${
//             movie.backdrop_path || movie.poster_path
//           }`}
//           className='rounded-lg w-full md:w-96 h-56 object-cover'
//         ></img>
//         <div className='p-2'>
//           <h2 className='text-lg mb-3 font-bold'>
//             {movie.title || movie.name}
//           </h2>
//           <p className='text-lg mb-3'>{movie.overview}</p>
//           <p className='mb-3'>
//             <span className='font-semibold mr-1'>Date Released:</span>
//             {movie.release_date || movie.first_air_date}
//           </p>
//           <p className='mb-3'>
//             <span className='font-semibold mr-1'>Rating:</span>
//             {movie.vote_count}
//           </p>
//           <AddToFav
//             movieId={movieId}
//             title={movie.title || movie.name}
//             image={movie.backdrop_path || movie.poster_path}
//             overview={movie.overview}
//             releaseDate={movie.release_date || movie.first_air_date}
//             voteCount={movie.vote_count}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



// import AddToFav from '@/components/AddToFav';
// import Link from 'next/link';
// import Image from 'next/image'; // Import the Next.js Image component for optimization
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

// async function generateVibeCheck(movie) {
//   // ... (this function remains exactly the same)
//   if (!GEMINI_API_KEY || !movie.overview || !movie.genres) {
//     return null;
//   }
  
//   try {
//     const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const genreNames = movie.genres.map(g => g.name).join(', ');
    
//     const prompt = `
//       You are a movie expert providing a "Vibe Check" for a user.
//       Based on the movie's title, genres, and plot summary, write a short, insightful paragraph (around 50-70 words).
//       Do not reveal any major spoilers.
//       Your goal is to describe the *feel* and *mood* of the movie and who would enjoy it. For example, is it a fast-paced thriller, a slow-burn drama, a lighthearted comedy?

//       Movie Title: ${movie.title}
//       Genres: ${genreNames}
//       Plot Summary: ${movie.overview}

//       Write the "Vibe Check" paragraph now.
//     `;

//     const result = await model.generateContent(prompt);
//     return result.response.text();
//   } catch (error) {
//     console.error("AI Vibe Check generation failed:", error.message);
//     return null;
//   }
// }

// export default async function MoviePage({ params }) {
//   // Fetch movie data and credits in one call
//   const res = await fetch(
//     `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.API_KEY}&append_to_response=credits,genres`
//   );
//   const movie = await res.json();

//   // Generate the AI Vibe Check
//   const vibeCheckText = await generateVibeCheck(movie);

//   if (!res.ok || !movie) {
//     return (
//       <div className='text-center mt-10'>
//         <h1 className='text-xl my-5'>Movie details are not available at the moment!</h1>
//         <p><Link href='/' className='hover:text-amber-600'>Go Home</Link></p>
//       </div>
//     );
//   }

//   return (
//     <div className='w-full'>
//       {/* Main Movie Details Section */}
//       <div className='p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6'>
//         <Image
//           src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`}
//           alt={`Poster for ${movie.title || movie.name}`}
//           width={500}
//           height={300}
//           className='rounded-lg w-full md:w-96 h-auto object-cover self-start'
//           style={{ maxWidth: '100%', height: 'auto' }}
//         />
//         <div className='p-2'>
//           <h2 className='text-2xl lg:text-3xl mb-3 font-bold'>{movie.title || movie.name}</h2>
//           <p className='text-lg mb-3'>{movie.overview}</p>
//           <p className='mb-3'>
//             <span className='font-semibold mr-1'>Date Released:</span>
//             {movie.release_date || movie.first_air_date}
//           </p>
//           <p className='mb-3'>
//             <span className='font-semibold mr-1'>Rating:</span>
//             {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)
//           </p>
          
//           {vibeCheckText && (
//             <div className='mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
//               <h3 className='text-xl font-bold mb-2 text-amber-500'>AI Vibe Check</h3>
//               <p className='text-md italic text-gray-300'>{vibeCheckText}</p>
//             </div>
//           )}

//           <div className='mt-6'>
//             <AddToFav movieId={params.id} title={movie.title || movie.name} /* ... other props */ />
//           </div>
//         </div>
//       </div>

//       {/* --- NEW: Top Billed Cast Section --- */}
//       <div className='p-4 md:pt-8 max-w-6xl mx-auto'>
//         <h3 className='text-2xl font-bold mb-4 border-b-2 border-gray-700 pb-2'>Top Billed Cast</h3>
//         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
//           {movie.credits?.cast?.slice(0, 10).map((actor) => (
//             <div key={actor.id} className='text-center'>
//               <Image
//                 src={actor.profile_path ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}` : '/placeholder-person.jpg'}
//                 alt={actor.name}
//                 width={185}
//                 height={278}
//                 className='rounded-lg object-cover mx-auto'
//               />
//               <p className='font-bold mt-2'>{actor.name}</p>
//               <p className='text-sm text-gray-400'>{actor.character}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// src/app/movie/[id]/page.js

import AddToFav from '@/components/AddToFav';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Results from '@/components/Results'; // Import the Results component for the 'similar' section

const GEMINI_API_KEY ="AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8" ;

// The AI Vibe Check function remains the same, no changes needed here
async function generateVibeCheck(movie) {
  if (!GEMINI_API_KEY || !movie.overview || !movie.genres) return null;
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const genreNames = movie.genres.map(g => g.name).join(', ');
    const prompt = `You are a movie expert providing a "Vibe Check" for a user. Based on the movie's title, genres, and plot summary, write a short, insightful paragraph (around 50-70 words). Do not reveal any major spoilers. Your goal is to describe the *feel* and *mood* of the movie and who would enjoy it. For example, is it a fast-paced thriller, a slow-burn drama, a lighthearted comedy? Movie Title: ${movie.title}, Genres: ${genreNames}, Plot Summary: ${movie.overview}. Write the "Vibe Check" paragraph now.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Vibe Check generation failed:", error.message);
    return null;
  }
}

export default async function MoviePage({ params }) {
  // MODIFIED: Added 'videos' and 'similar' to get all data at once
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.API_KEY}&append_to_response=credits,genres,videos,similar`
  );
  const movie = await res.json();
  const vibeCheckText = await generateVibeCheck(movie);

  // NEW: Find the official trailer from the videos list
  const trailer = movie.videos?.results?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  if (!res.ok || !movie.id) {
    return (
      <div className='text-center mt-10'>
        <h1 className='text-xl my-5'>Movie details are not available at the moment!</h1>
        <p><Link href='/' className='hover:text-amber-600'>Go Home</Link></p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Main Movie Details Section */}
      <div className='p-4 md:pt-8 flex flex-col md:flex-row content-center max-w-6xl mx-auto md:space-x-6'>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={`Poster for ${movie.title || movie.name}`}
          width={500}
          height={300}
          className='rounded-lg w-full md:w-96 h-auto object-cover self-start'
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div className='p-2'>
          <h2 className='text-2xl lg:text-3xl mb-3 font-bold'>{movie.title || movie.name}</h2>
          <p className='text-lg mb-3'>{movie.overview}</p>
          <p className='mb-3'><span className='font-semibold mr-1'>Date Released:</span> {movie.release_date || movie.first_air_date}</p>
          <p className='mb-3'><span className='font-semibold mr-1'>Rating:</span> {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)</p>
          {vibeCheckText && (
            <div className='mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
              <h3 className='text-xl font-bold mb-2 text-amber-500'>AI Vibe Check</h3>
              <p className='text-md italic text-gray-300'>{vibeCheckText}</p>
            </div>
          )}
          <div className='mt-6'><AddToFav movieId={params.id} title={movie.title || movie.name} /* ... other props */ /></div>
        </div>
      </div>
      
      <div className='p-4 md:pt-8 max-w-6xl mx-auto'>
        {/* --- NEW: Official Trailer Section --- */}
        {trailer && (
          <div className='my-6'>
            <h3 className='text-2xl font-bold mb-4'>Official Trailer</h3>
            <iframe
              className='w-full aspect-video rounded-lg'
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* --- Top Billed Cast Section --- */}
        <div className='my-6'>
          <h3 className='text-2xl font-bold mb-4'>Top Billed Cast</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {movie.credits?.cast?.slice(0, 10).map((actor) => (
              <div key={actor.id} className='text-center'>
                <Image src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/placeholder-person.jpg'} alt={actor.name} width={185} height={278} className='rounded-lg object-cover mx-auto' />
                <p className='font-bold mt-2'>{actor.name}</p>
                <p className='text-sm text-gray-400'>{actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- NEW: You Might Also Like Section --- */}
        {movie.similar?.results?.length > 0 && (
          <div className='my-6'>
            <h3 className='text-2xl font-bold mb-4'>You Might Also Like</h3>
            <Results results={movie.similar.results} />
          </div>
        )}
      </div>
    </div>
  );
}