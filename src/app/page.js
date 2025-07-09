import Results from '@/components/Results';
// const API_KEY = process.env.API_KEY;
// export default async function Home() {
//   const res = await fetch(
//     `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
//   );
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   const results = data.results;

//   return (  
//       <div>
//         <Results results={results} />
//       </div>
//   );
// }
export const dynamic = 'force-dynamic';

const API_KEY = process.env.API_KEY;
console.log('API_KEY:', API_KEY); // Ensure not undefined

export default async function Home() {
  if (!API_KEY) throw new Error('Missing TMDb API_KEY');

  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
  );
  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`TMDb error ${res.status}`);
  }

  const { results } = await res.json();
  return <Results results={results} />;
}
