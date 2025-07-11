import Results from '@/components/Results';
const API_KEY = process.env.API_KEY;
export default async function Home({ params }) {
  const { genre } = await params;
  const res = await fetch(
    `https://api.themoviedb.org/3${
      genre === 'rated' ? `/movie/top_rated` : `/trending/all/week`
    }?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const results = data.results;

  return (
    <div>
      <Results results={results} />
    </div>
  );
}
// import PaginatedResults from "@/components/PaginatedResults";

// const API_KEY = process.env.API_KEY;

// export default async function Home({ params }) {
//   const genre = params.genre;
//   const endpoint =
//     genre === "rated" ? "/movie/top_rated" : "/trending/all/week";
//   const res = await fetch(
//     `https://api.themoviedb.org/3${endpoint}?api_key=${API_KEY}&language=en-US&page=1`
//   );

//   if (!res.ok) {
//     throw new Error(`TMDb fetch failed: ${res.status}`);
//   }

//   const data = await res.json();

//   return (
//     <PaginatedResults
//       initialResults={data.results}
//       initialPage={data.page}
//       totalPages={data.total_pages}
//       genre={genre}
//     />
//   );
// }
