
// import Results from '@/components/Results';
// import { connect } from '../lib/mongodb/mongoose'; // Make sure this path is correct
// import HomePageContent from '../lib/models/homePageContent.model'; // Make sure this path is correct

// // This ensures the page is always dynamic, fetching fresh data on every visit
// export const dynamic = 'force-dynamic';

// const API_KEY = process.env.API_KEY;

// // The main page component is async to allow for data fetching
// export default async function Home() {
//   // We will fetch data from two different sources
//   let aiContent = null;
//   let movieResults = [];

//   // --- 1. Fetch AI-generated content from MongoDB ---
//   try {
//     await connect();
//     const contentData = await HomePageContent.findOne({ updatedBy: 'github-actions' })
//       .sort({ updatedAt: -1 })
//       .lean();
    
//     if (contentData) {
//       aiContent = JSON.parse(JSON.stringify(contentData));
//     }
//   } catch (error) {
//     console.error("Failed to fetch content from MongoDB:", error);
//     // If this fails, we can still show the movie list
//   }

//   // --- 2. Fetch trending movies list from TMDB API ---
//   try {
//     if (!API_KEY) throw new Error('Missing TMDb API_KEY');
    
//     const res = await fetch(
//       `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
//     );

//     if (!res.ok) {
//       console.error(await res.text());
//       throw new Error(`TMDb API error ${res.status}`);
//     }

//     const data = await res.json();
//     movieResults = data.results;
//   } catch (error) {
//     console.error("Failed to fetch movies from TMDb:", error.message);
//     // If this fails, we can still show the AI content
//   }


//   // --- 3. Render the full page with both sections ---
//   return (
//     <div>
//       {/* Section 1: Renders the AI Content from MongoDB if it exists */}
//       {aiContent && (
//         <div className="max-w-4xl mx-auto p-6">
//           <h1 className="text-4xl font-bold mb-4 text-center">{aiContent.title}</h1>
//           <div
//             className="prose max-w-none text-lg leading-relaxed mt-6"
//             dangerouslySetInnerHTML={{ __html: aiContent.description }}
//           />
//         </div>
//       )}

//       {/* A visual divider between the two sections */}
//       <hr className="my-8 border-gray-200 dark:border-gray-700 max-w-4xl mx-auto" />

//       {/* Section 2: Renders the list of movies from TMDB */}
//       {movieResults && movieResults.length > 0 ? (
//         <Results results={movieResults} />
//       ) : (
//         <p className="text-center">Could not load trending movies.</p>
//       )}
//     </div>
//   );
// }
// src/app/page.js

// import { connect } from '@/lib/mongodb/mongoose';
// import HomePageContent from '@/lib/models/homePageContent.model';

// export const dynamic = 'force-dynamic';

// export default async function Home() {
//   await connect();
//   const homepageData = await HomePageContent.findOne({ updatedBy: 'github-actions' }).lean();

//   if (!homepageData || !homepageData.sections || homepageData.sections.length === 0) {
//     return (
//       <main className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Welcome!</h1>
//           <p className="text-lg mt-2">Our AI is generating fresh content. Please check back in a moment.</p>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       {/* Main Page Title */}
//       <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-500 to-amber-500 bg-clip-text text-transparent">
//         {homepageData.mainTitle}
//       </h1>

//       {/* Loop Through and Display Each AI-Generated Section */}
//       <div className="space-y-16">
//         {homepageData.sections.map((section, index) => (
//           <section key={index}>
//             <h2 className="text-3xl font-bold mb-4 border-b-2 border-amber-500 pb-2">
//               {section.title}
//             </h2>
//             <div
//               className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed"
//               dangerouslySetInnerHTML={{ __html: section.description }}
//             />
//           </section>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/app/page.js

import { connect } from '@/lib/mongodb/mongoose';
import HomePageContent from '@/lib/models/homePageContent.model';
import Results from '@/components/Results'; // We are adding this back

export const dynamic = 'force-dynamic';
const API_KEY = process.env.API_KEY; // Make sure API_KEY is in your .env and production environment variables

async function fetchTrendingForGrid() {
  try {
    if (!API_KEY) throw new Error('API Key not found for trending grid');
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`);
    if (!res.ok) throw new Error('Failed to fetch trending movies for grid');
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error.message);
    return []; // Return empty array on failure
  }
}

export default async function Home() {
  // Connect to DB once
  await connect();
  
  // Fetch both the AI content and the trending movies list at the same time
  const [homepageData, trendingMovies] = await Promise.all([
    HomePageContent.findOne({ updatedBy: 'github-actions' }).lean(),
    fetchTrendingForGrid()
  ]);

  if (!homepageData || !homepageData.sections || homepageData.sections.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="text-lg mt-2">Our AI is generating fresh content. Please check back in a moment.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Main Page Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-purple-500 to-amber-500 bg-clip-text text-transparent">
        {homepageData.mainTitle}
      </h1>

      {/* Loop Through and Display Each AI-Generated Section */}
      <div className="space-y-16">
        {homepageData.sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-3xl font-bold mb-4 border-b-2 border-amber-500 pb-2">
              {section.title}
            </h2>
            <div
              className="prose prose-invert max-w-none text-lg text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.description }}
            />
          </section>
        ))}
      </div>

      {/* A visual divider */}
      <hr className="my-16 border-gray-700" />

      {/* The grid of trending movie posters at the bottom */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Top Trending This Week</h2>
        {trendingMovies.length > 0 ? (
          <Results results={trendingMovies} />
        ) : (
          <p className="text-center">Could not load trending movie grid.</p>
        )}
      </div>
    </div>
  );
}