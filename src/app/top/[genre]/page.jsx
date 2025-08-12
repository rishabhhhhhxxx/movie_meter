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

// This code should replace the content of the file that handles your dynamic genre pages

// This code should replace the content of the file that handles your dynamic genre pages

import Results from '@/components/Results';
import PaginationButtons from '@/components/PaginationButtons';

const API_KEY = process.env.API_KEY;

export default async function GenrePage({ params, searchParams }) {
  // Get the genre from the URL, e.g., 'trending' or 'rated'
  const genre = params.genre;

  // Read the page number from the URL, e.g., "?page=2". Default to 1.
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  
  // --- THIS IS THE FIX ---
  // We check if the genre is 'rated' to decide which API path and page title to use.
  const isTopRated = genre === 'rated';
  
  const apiPath = isTopRated ? '/movie/top_rated' : '/trending/all/week';
  const pageTitle = isTopRated ? 'All-Time Top Rated' : 'Trending This Week';
  const basePath = isTopRated ? '/top/rated' : '/top/trending';
  // --- END OF FIX ---

  const res = await fetch(
    `https://api.themoviedb.org/3${apiPath}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  
  const results = data.results;
  const totalPages = data.total_pages;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-amber-500">{pageTitle}</h1>
      <Results results={results} />
      
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        basePath={basePath}
      />
    </div>
  );
}

// https://movie-meter-zeta.vercel.app/top/trending?page=2
// https://movie-meter-zeta.vercel.app/?page=3