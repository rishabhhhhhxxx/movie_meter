// import Results from '@/components/Results';
// export default async function SearchPage({ params }) {
//   const { searchTerm } = await params;
//   const res = await fetch(
//     `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&language=en-US&page=1&include_adult=false`
//   );
//   const data = await res.json();
//   const results = data.results;
//   return (
//     <div>
//       {!results ||
//         (results.length === 0 && (
//           <h1 className='text-center pt-6'>No results found</h1>
//         ))}
//       {results && results.length !== 0 && <Results results={results} />}
//     </div>
//   );
// }
// src/app/search/[searchTerm]/page.jsx (Updated with Pagination)

// import Results from '@/components/Results';
// import Pagination from '@/components/Pagination'; // Import our new pagination component

// export default async function SearchPage({ params, searchParams }) {
//   const searchTerm = params.searchTerm;
  
//   // 1. Read the page number from the URL (e.g., "?page=2"). Default to page 1.
//   const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

//   // 2. Pass the 'page' variable to the API fetch call.
//   const res = await fetch(
//     `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&page=${page}&include_adult=false`
//   );

//   if (!res.ok) {
//     throw new Error('Error fetching data');
//   }

//   const data = await res.json();
//   const results = data.results;
  
//   // 3. Get the total number of pages from the API response.
//   const totalPages = data.total_pages;

//   return (
//     <div>
//       {results && results.length === 0 && (
//         <h1 className='text-center pt-6'>No results found for "{searchTerm}"</h1>
//       )}

//       {results && <Results results={results} />}

//       {/* 4. Render the Pagination component with the necessary info. */}
//       <Pagination 
//         currentPage={page} 
//         totalPages={totalPages} 
//         searchTerm={searchTerm} 
//       />
//     </div>
//   );
// }
// src/app/search/[searchTerm]/page.jsx

import Results from '@/components/Results';
// Import the new, reusable component
import PaginationButtons from '@/components/PaginationButtons';

export default async function SearchPage({ params, searchParams }) {
  const searchTerm = params.searchTerm;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${searchTerm}&page=${page}&include_adult=false`
  );

  if (!res.ok) {
    throw new Error('Error fetching data');
  }

  const data = await res.json();
  const results = data.results;
  const totalPages = data.total_pages;

  return (
    <div>
      {/* ... results display ... */}
      {results && <Results results={results} />}

      {/* Use the new component, passing the basePath for search */}
      <PaginationButtons
        currentPage={page}
        totalPages={totalPages}
        basePath={`/search/${searchTerm}`}
      />
    </div>
  );
}