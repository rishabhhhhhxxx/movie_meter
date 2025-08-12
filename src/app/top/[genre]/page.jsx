// import Results from '@/components/Results';
// const API_KEY = process.env.API_KEY;
// export default async function Home({ params }) {
//   const { genre } = await params;
//   const res = await fetch(
//     `https://api.themoviedb.org/3${
//       genre === 'rated' ? `/movie/top_rated` : `/trending/all/week`
//     }?api_key=${API_KEY}&language=en-US&page=1`
//   );
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   const results = data.results;

//   return (
//     <div>
//       <Results results={results} />
//     </div>
//   );
// }
// This code should replace the content of the file that contains your Home component.

import Results from '@/components/Results';
import PaginationButtons from '@/components/PaginationButtons'; // Import our new component

const API_KEY = process.env.API_KEY;

export default async function Home({ params, searchParams }) {
  // Determine if we're on a genre page (like '/rated') or the homepage
  const genre = params.genre || 'trending'; // Default to 'trending'

  // Read the page number from the URL, e.g., "?page=3". Default to 1.
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  
  // Construct the API URL based on the genre and page number
  const res = await fetch(
    `https://api.themoviedb.org/3${
      genre === 'rated' ? `/movie/top_rated` : `/trending/all/week`
    }?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  const results = data.results;
  const totalPages = data.total_pages;

  // Determine the base path for the pagination links
  // const basePath = genre === 'rated' ? '/rated' : '/';
  const basePath = genre === 'rated' ? '/top/rated' : '/';
  return (
    <div>
      <Results results={results} />
      
      {/* Render the PaginationButtons with the correct data */}
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        basePath={basePath}
      />
    </div>
  );
}