
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
// import { connect } from './lib/mongodb/mongoose.js';
// import HomePageContent from './lib/models/homePageContent.model.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // --- Configuration ---
// // Please remember to move these to a .env file for security!
// const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
// const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";
// const MONGODB_URI="mongodb+srv://22bec099:PqRcf7dphHvRNYqO@cluster0.4z0rvot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // --- Section Definitions ---
// // This is where you control your homepage content. Add or change sections here!
// const SECTIONS_TO_GENERATE = [
//   {
//     title: "This Week's Must-See Trending Movies",
//     type: 'trending',
//   },
//   {
//     title: 'Spotlight on Sci-Fi Wonders',
//     type: 'genre',
//     genreId: 878,
//   },
//   {
//     title: `Best Comedies of ${new Date().getFullYear()}`,
//     type: 'yearly_best',
//     genreId: 35,
//     year: new Date().getFullYear(),
//   },
// ];

// async function fetchMoviesForSection(section) {
//   let url = '';
//   console.log(`Fetching movies for section: "${section.title}"...`);

//   switch (section.type) {
//     case 'trending':
//       url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`;
//       break;
//     case 'genre':
//       url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${section.genreId}&sort_by=popularity.desc&language=en-US&page=1`;
//       break;
//     case 'yearly_best':
//       url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${section.genreId}&primary_release_year=${section.year}&sort_by=vote_average.desc&vote_count.gte=100`;
//       break;
//     default:
//       return [];
//   }

//   const response = await fetch(url);
//   if (!response.ok) throw new Error(`TMDB fetch failed for ${section.title}`);
//   const data = await response.json();
//   return data.results.map(movie => ({ id: movie.id, title: movie.title || movie.name }));
// }

// async function generateAISection(section, movies) {
//   console.log(`Generating AI content for section: "${section.title}"...`);
//   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//   const prompt = `
//     You are a movie blogger writing a small section for a homepage.
//     The title of this section is "${section.title}".
//     Based on this title and the following movies, write an engaging descriptive paragraph (around 150 characters long).
//     Movies list: ${JSON.stringify(movies.slice(0, 10))}
//     Crucially, whenever you mention a movie, wrap its title in an HTML anchor tag with this format:
//     \`<a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="/movie/{movieId}">Movie Title</a>\`
//     Your response MUST ONLY be the descriptive paragraph. Do not include the section title. Just the paragraph text.
//   `;

//   const result = await model.generateContent(prompt);
//   return result.response.text().trim();
// }

// async function main() {
//   console.log('Script started: Generating multi-section homepage content.');
//   await connect();

//   const allSections = [];
//   const mainTitle = "Your Ultimate Movie Guide: Trending, Genres, and Yearly Bests!";

//   for (const section of SECTIONS_TO_GENERATE) {
//     try {
//       const movies = await fetchMoviesForSection(section);
//       if (movies.length > 0) {
//         const description = await generateAISection(section, movies);
//         allSections.push({
//           title: section.title,
//           description: description,
//         });
//       }
//     } catch (error) {
//       console.error(`Could not generate content for section "${section.title}": ${error.message}`);
//     }
//   }

//   console.log('Saving all generated sections to the database...');
//   await HomePageContent.findOneAndUpdate(
//     { updatedBy: 'github-actions' },
//     {
//       $set: {
//         mainTitle: mainTitle,
//         sections: allSections,
//         updatedBy: 'github-actions',
//       },
//     },
//     { upsert: true, new: true }
//   );

//   console.log('Homepage content with multiple sections has been updated!');
// }

// main().catch(console.error).finally(() => process.exit(0));
// src/generateHomePageContentRunner.js

// import 'dotenv/config';
import { connect } from './lib/mongodb/mongoose.js';
import HomePageContent from './lib/models/homePageContent.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---
// Remember to replace these with environment variables for security!
const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";


// --- Section Definitions ---
// We've added the new sections you requested!
const SECTIONS_TO_GENERATE = [
  {
    title: "This Week's Must-See Trending Movies",
    type: 'trending',
  },
  {
    title: 'Spotlight on Sci-Fi Wonders',
    type: 'genre',
    genreId: 878,
  },
  {
    title: 'Spine-Chilling Horror Hits', // <-- NEW
    type: 'genre',
    genreId: 27,
  },
  {
    title: 'The World of Animation', // <-- NEW
    type: 'genre',
    genreId: 16,
  },
  {
    title: 'Epic Superhero Sagas', // <-- NEW
    type: 'keyword', // We use 'keyword' type for superheroes
    keywordId: 9715, // The TMDB keyword ID for "superhero"
  },
];

async function fetchMoviesForSection(section) {
  let url = '';
  console.log(`Fetching movies for section: "${section.title}"...`);

  switch (section.type) {
    case 'trending':
      url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`;
      break;
    case 'genre':
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${section.genreId}&sort_by=popularity.desc&language=en-US&page=1`;
      break;
    case 'keyword': // <-- NEW CASE to handle keywords
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=${section.keywordId}&sort_by=popularity.desc&language=en-US&page=1`;
      break;
    default:
      return [];
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB fetch failed for ${section.title}`);
  const data = await response.json();
  return data.results.map(movie => ({ id: movie.id, title: movie.title || movie.name }));
}

// ... The `generateAISection` function remains exactly the same ...
async function generateAISection(section, movies) {
  console.log(`Generating AI content for section: "${section.title}"...`);
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are a movie blogger writing a small section for a homepage.
    The title of this section is "${section.title}".
    Based on this title and the following movies, write an engaging descriptive paragraph (around 150 characters long).
    Movies list: ${JSON.stringify(movies.slice(0, 10))}
    Crucially, whenever you mention a movie, wrap its title in an HTML anchor tag with this format:
    \`<a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="/movie/{movieId}">Movie Title</a>\`
    Your response MUST ONLY be the descriptive paragraph. Do not include the section title. Just the paragraph text.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}


// ... The `main` and execution block also remain the same ...
async function main() {
  console.log('Script started: Generating multi-section homepage content.');
  await connect();

  const allSections = [];
  const mainTitle = "Your Ultimate Movie Guide: All The Latest Buzz!";

  for (const section of SECTIONS_TO_GENERATE) {
    try {
      const movies = await fetchMoviesForSection(section);
      if (movies.length > 0) {
        const description = await generateAISection(section, movies);
        allSections.push({
          title: section.title,
          description: description,
        });
      }
    } catch (error) {
      console.error(`Could not generate content for section "${section.title}": ${error.message}`);
    }
  }

  console.log('Saving all generated sections to the database...');
  await HomePageContent.findOneAndUpdate(
    { updatedBy: 'github-actions' },
    {
      $set: {
        mainTitle: mainTitle,
        sections: allSections,
        updatedBy: 'github-actions',
      },
    },
    { upsert: true, new: true }
  );

  console.log('Homepage content with multiple sections has been updated!');
}

main().catch(console.error).finally(() => process.exit(0));