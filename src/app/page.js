// import Results from '@/components/Results';

// export const dynamic = 'force-dynamic';

// const API_KEY = process.env.API_KEY;
// console.log('API_KEY:', API_KEY); // Ensure not undefined

// export default async function Home() {
//   if (!API_KEY) throw new Error('Missing TMDb API_KEY');

//   const res = await fetch(
//     `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
//   );
//   if (!res.ok) {
//     console.error(await res.text());
//     throw new Error(`TMDb error ${res.status}`);
//   }

//   const { results } = await res.json();
//   return <Results results={results} />;
// }
// src/app/page.js

import Results from '@/components/Results';
import { connect } from '../lib/mongodb/mongoose'; // Make sure this path is correct
import HomePageContent from '../lib/models/homePageContent.model'; // Make sure this path is correct

// This ensures the page is always dynamic, fetching fresh data on every visit
export const dynamic = 'force-dynamic';

const API_KEY = process.env.API_KEY;

// The main page component is async to allow for data fetching
export default async function Home() {
  // We will fetch data from two different sources
  let aiContent = null;
  let movieResults = [];

  // --- 1. Fetch AI-generated content from MongoDB ---
  try {
    await connect();
    const contentData = await HomePageContent.findOne({ updatedBy: 'github-actions' })
      .sort({ updatedAt: -1 })
      .lean();
    
    if (contentData) {
      aiContent = JSON.parse(JSON.stringify(contentData));
    }
  } catch (error) {
    console.error("Failed to fetch content from MongoDB:", error);
    // If this fails, we can still show the movie list
  }

  // --- 2. Fetch trending movies list from TMDB API ---
  try {
    if (!API_KEY) throw new Error('Missing TMDb API_KEY');
    
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
    );

    if (!res.ok) {
      console.error(await res.text());
      throw new Error(`TMDb API error ${res.status}`);
    }

    const data = await res.json();
    movieResults = data.results;
  } catch (error) {
    console.error("Failed to fetch movies from TMDb:", error.message);
    // If this fails, we can still show the AI content
  }


  // --- 3. Render the full page with both sections ---
  return (
    <div>
      {/* Section 1: Renders the AI Content from MongoDB if it exists */}
      {aiContent && (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-4 text-center">{aiContent.title}</h1>
          <div
            className="prose max-w-none text-lg leading-relaxed mt-6"
            dangerouslySetInnerHTML={{ __html: aiContent.description }}
          />
        </div>
      )}

      {/* A visual divider between the two sections */}
      <hr className="my-8 border-gray-200 dark:border-gray-700 max-w-4xl mx-auto" />

      {/* Section 2: Renders the list of movies from TMDB */}
      {movieResults && movieResults.length > 0 ? (
        <Results results={movieResults} />
      ) : (
        <p className="text-center">Could not load trending movies.</p>
      )}
    </div>
  );
}