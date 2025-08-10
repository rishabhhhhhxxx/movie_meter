
// import 'dotenv/config'; // Make sure to install dotenv: npm install dotenv
// import { connect } from './lib/mongodb/mongoose.js';
// import HomePageContent from './lib/models/homePageContent.model.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // --- Configuration ---
// // DANGER: Hardcoding API keys is a major security risk.
// // Anyone with access to this code can steal and use your keys.
// const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
// const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

// /*
// // RECOMMENDED: Use environment variables for security.
// // 1. Create a file named ".env" in your project root.
// // 2. Add your keys to the .env file like this:
// //    TMDB_API_KEY=your_tmdb_key_here
// //    GEMINI_API_KEY=your_gemini_key_here
// // 3. Use them in your code like this:
// // const API_KEY = process.env.TMDB_API_KEY;
// // const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// */

// // List of themes for the script to randomly choose from.
// // You can add or remove any genres you like. Find IDs on the TMDB website.
// const THEMES = [
//   { name: 'Action-Packed Adventures', genreId: 28 },
//   { name: 'Hilarious Comedies', genreId: 35 },
//   { name: 'Sci-Fi Worlds & Wonders', genreId: 878 },
//   { name: 'Spine-Chilling Horrors', genreId: 27 },
//   { name: 'Heartwarming Romances', genreId: 10749 },
//   { name: 'Epic Fantasy Sagas', genreId: 14 },
//   { name: 'Gripping Crime Thrillers', genreId: 80 },
// ];


// /**
//  * Fetches popular movies from TMDB based on a specific theme (genre).
//  * @param {{ name: string, genreId: number }} theme - The selected theme object.
//  * @returns {Promise<Array<{id: number, title: string}>>} A list of movies matching the theme.
//  */
// async function fetchThemedMovies(theme) {
//   console.log(`Fetching movies for theme: "${theme.name}"...`);
//   // We use the /discover/movie endpoint which is perfect for finding movies by genre
//   const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${theme.genreId}&sort_by=popularity.desc&language=en-US&page=1`;
  
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`TMDB API request failed with status: ${response.status}`);
//   }

//   const data = await response.json();
//   console.log(`Fetched ${data.results.length} movies for the theme.`);
  
//   return data.results.map(movie => ({
//     id: movie.id,
//     title: movie.title || movie.name,
//   }));
// }


// /**
//  * Generates homepage content using Google Gemini AI based on a theme and a list of movies.
//  * @param {Array<{id: number, title: string}>} movies - The list of themed movies.
//  * @param {{ name: string, genreId: number }} theme - The selected theme object.
//  * @returns {Promise<{title: string, description: string}>} The AI-generated content.
//  */
// async function generateAIContent(movies, theme) {
//   console.log('Initializing Google Gemini client...');
//   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   console.log(`Building prompt for the theme: "${theme.name}"...`);

//   const prompt = `
//     You are a passionate film critic writing a special feature for a movie website's homepage.
//     This week's theme is: "${theme.name}".
//     Use the following list of movies as examples for your article.
//     Movies list: ${JSON.stringify(movies)}

//     Your response MUST be a single, valid JSON object with a "title" and a "description".
//     - The "title" should be a catchy headline about the "${theme.name}" theme.
//     - The "description" should be an exciting paragraph about the theme, referencing several movies from the list.
//     - CRUCIALLY, whenever you mention a movie, you MUST wrap its title in an HTML anchor tag with this exact format:
//       \`<a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="/movie/{movieId}">Movie Title</a>\`
//       Replace "{movieId}" with the movie's 'id'.

//     IMPORTANT: Return ONLY the raw JSON object. Do not add any notes or markdown formatting.
//   `;

//   console.log('Sending themed prompt to Gemini AI model...');
//   const result = await model.generateContent(prompt);
//   const text = result.response.text();
//   console.log('Received response from Gemini AI.');

//   try {
//     const cleanedText = text.replace(/`{3}(?:json)?\n?/g, '').trim();
//     return JSON.parse(cleanedText);
//   } catch (err) {
//     console.error('Raw AI response that failed to parse:', text);
//     throw new Error('Failed to parse JSON from Gemini AI response.');
//   }
// }

// /**
//  * Saves the generated content to the MongoDB database.
//  * @param {{title: string, description: string}} content - The content to save.
//  */
// async function saveContentToDB(content) {
//   console.log('Connecting to MongoDB...');
//   await connect();
//   console.log('Connected to MongoDB. Saving content...');

//   const savedContent = await HomePageContent.findOneAndUpdate(
//     { updatedBy: 'github-actions' }, // Find the document to update
//     {
//       $set: { // Set the new values
//         title: content.title,
//         description: content.description,
//         updatedBy: 'github-actions',
//       },
//     },
//     { new: true, upsert: true } // Options: return the new doc, and create if it doesn't exist
//   );

//   console.log('Home page content successfully updated in database.');
//   return savedContent;
// }


// /**
//  * Main function to orchestrate the themed content generation process.
//  */
// async function main() {
//   console.log('Script started.');
//   console.time('Total Execution Time');

//   // 1. Select a random theme from our list
//   const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
//   console.log(`This week's randomly selected theme is: "${randomTheme.name}"`);

//   // 2. Fetch movies based on the selected theme
//   const movies = await fetchThemedMovies(randomTheme);

//   // 3. Generate AI content based on the theme and movies
//   const aiContent = await generateAIContent(movies, randomTheme);

//   // 4. Save the new content to the database
//   await saveContentToDB(aiContent);

//   console.timeEnd('Total Execution Time');
// }


// // --- Script Execution ---
// main()
//   .then(() => {
//     console.log('Generation task completed successfully.');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('An error occurred during the script execution:', error.message);
//     process.exit(1);
//   });
// src/generateHomePageContentRunner.js

import 'dotenv/config';
import { connect } from './lib/mongodb/mongoose.js';
import HomePageContent from './lib/models/homePageContent.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---
// Please remember to move these to a .env file for security!
const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

// --- Section Definitions ---
// This is where you control your homepage content. Add or change sections here!
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
    title: `Best Comedies of ${new Date().getFullYear()}`,
    type: 'yearly_best',
    genreId: 35,
    year: new Date().getFullYear(),
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
    case 'yearly_best':
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${section.genreId}&primary_release_year=${section.year}&sort_by=vote_average.desc&vote_count.gte=100`;
      break;
    default:
      return [];
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`TMDB fetch failed for ${section.title}`);
  const data = await response.json();
  return data.results.map(movie => ({ id: movie.id, title: movie.title || movie.name }));
}

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

async function main() {
  console.log('Script started: Generating multi-section homepage content.');
  await connect();

  const allSections = [];
  const mainTitle = "Your Ultimate Movie Guide: Trending, Genres, and Yearly Bests!";

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