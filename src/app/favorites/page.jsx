// 'use client';

// import Results from '@/components/Results';
// import { useEffect, useState } from 'react';

// import { useUser } from '@clerk/nextjs';

// export default function Favorites() {
//   const [results, setResults] = useState(null);
//   const { isSignedIn, user, isLoaded } = useUser();
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('/api/user/getFav', {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setResults(data.favs);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };
//     if (isLoaded && isSignedIn && user) {
//       fetchData();
//     }
//   }, []);

//   if (!isSignedIn) {
//     return (
//       <div className='text-center mt-10'>
//         <h1 className='text-xl my-5'>Please sign in to view your favorites</h1>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {!results ||
//         (results.length === 0 && (
//           <h1 className='text-center pt-6'>No results found</h1>
//         ))}
//       {results && results.length !== 0 && (
//         <Results
//           results={results.map((result) => ({
//             ...result,
//             id: result.movieId,
//             title: result.title,
//             backdrop_path: result.image,
//             overview: result.description,
//             first_air_date: result.dateReleased.substring(0, 10),
//             vote_count: result.rating,
//           }))}
//         />
//       )}
//     </div>
//   );
// }
// src/app/favorites/page.jsx (Corrected Version)

// src/app/favorites/page.jsx (Corrected for your new user model)

'use client';

import Results from '@/components/Results';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Favorites() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            // Using the PUT method as you previously requested
            const res = await fetch('/api/user/getFav', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
              const data = await res.json();
              setResults(data.favs || []);
            } else {
              console.error('Failed to fetch favorites:', await res.text());
              setResults([]);
            }
          } catch (error) {
            console.error('Error fetching favorites:', error);
            setResults([]);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn]);

  if (isLoading) {
    return (
      <div className='text-center mt-10'>
        <h1 className='text-xl my-5'>Loading your favorites...</h1>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='text-center mt-10'>
        <h1 className='text-xl my-5'>Please <Link href="/sign-in" className="underline text-amber-500">sign in</Link> to view your favorites.</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-4xl font-bold text-center my-8'>Your Favorites</h1>
      {results.length === 0 ? (
        <h2 className='text-center text-xl text-gray-400'>You have no favorite movies yet.</h2>
      ) : (
        <Results
          results={results.map((result) => ({
            // --- THIS MAPPING IS NOW CORRECTED FOR YOUR NEW SCHEMA ---

            // The Results component expects a standard TMDB movie object.
            // We are "translating" the data from your `favs` array to match it.
            
            id: result.movieId,
            title: result.title,
            backdrop_path: result.image,
            poster_path: result.image,
            overview: result.description, // Use `description` from your schema
            
            // Format the Date object from MongoDB into a YYYY-MM-DD string
            release_date: new Date(result.dateReleased).toISOString().substring(0, 10),
            
            vote_count: result.rating, // Use `rating` from your schema
          }))}
        />
      )}
    </div>
  );
}