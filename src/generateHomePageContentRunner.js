// import 'dotenv/config';
// import { connect } from './lib/mongodb/mongoose.js';
// import HomePageContent from './lib/models/homePageContent.model.js';

// import { GoogleGenerativeAI } from '@google/generative-ai';

// const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
// const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

// async function generateHomePageContent() {
//   console.log('Starting Google Gemini client setup...');
//   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   console.log('Google Gemini client ready.');

//   console.log('Fetching trending movies from TMDB...');
//   const trendingMoviesResults = await fetch(
//     `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
//   )
//     .then((res) => {
//       console.log('TMDB fetch response status:', res.status);
//       if (!res.ok) throw new Error('Failed to fetch data');
//       return res.json();
//     })
//     .then((data) => {
//       console.log('Fetched trending movies count:', data.results.length);
//       return data.results;
//     });
  
//   console.log('Building prompt for Gemini AI...');
//   const prompt = `
//     Analyze these movies ${JSON.stringify(
//       trendingMoviesResults
//     )} and provide a title and description in ONLY the following JSON format without any additional notes or explanations (add a link for each movie with this address '/movie/{movieId}' with html format like this: <a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href='/movie/{movieId}'>Movie Title</a>):
//     {
//       "title": "exciting title about new trending movies",
//       "description": "exciting description about new trending movies"
//     }
    
//     IMPORTANT: Return ONLY the JSON. No additional text, notes.
//     Include at least 150 characters for description.
//     Include at least 50 characters for title.
//   `;

//   console.log('Sending prompt to Gemini AI model...');
//   const googleGeminiResults = await model.generateContent(prompt);
//   console.log('Received response from Gemini AI.');

//   const text =
//     googleGeminiResults.response.candidates[0].content.parts[0].text || '';
//   console.log('Raw Gemini AI response text:', text.substring(0, 200), '...');

//   const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();
//   console.log('Cleaned response text:', cleanedText.substring(0, 200), '...');

//   let homePageContentFromGoogleGemini;
//   try {
//     homePageContentFromGoogleGemini = JSON.parse(cleanedText);
//     console.log('Parsed Gemini AI response JSON:', homePageContentFromGoogleGemini);
//   } catch (err) {
//     console.error('Failed to parse JSON from Gemini AI response:', err);
//     throw err; // rethrow to be caught in the main catch
//   }

//   console.log('Connecting to MongoDB...');
//   await connect(process.env.MONGODB_URI);
//   console.log('Connected to MongoDB.');

//   console.log('Saving home page content to database...');
//   const saved = await HomePageContent.findOneAndUpdate(
//     { updatedBy: 'github-actions' },
//     {
//       $set: {
//         title: homePageContentFromGoogleGemini.title,
//         description: homePageContentFromGoogleGemini.description,
//         updatedBy: 'github-actions',
//       },
//     },
//     { new: true, upsert: true }
//   );
//   console.log('Home page content updated:', saved);
// }

// console.log('Script started');

// generateHomePageContent()
//   .then(() => {
//     console.log('Generation task completed successfully');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('Error generating home page content:', error);
//     process.exit(1);
//   });

// console.log('Script ended');
//
// generateHomePageContentRunner.js (Improved Version)
//
// import 'dotenv/config'; // Make sure to install dotenv: npm install dotenv
// import { connect } from './lib/mongodb/mongoose.js';
// import HomePageContent from './lib/models/homePageContent.model.js';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // --- Configuration ---
// // DANGER: Hardcoding API keys is a major security risk.
// // Anyone with access to this code can steal and use your keys.
// const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
// const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";



// /**
//  * Fetches the weekly trending movies from TMDB and returns a simplified list.
//  * @returns {Promise<Array<{id: number, title: string}>>} A list of movies with only id and title.
//  */
// async function fetchTrendingMovies() {
//   console.log('Fetching trending movies from TMDB...');
//   const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`;
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`TMDB API request failed with status: ${response.status}`);
//   }

//   const data = await response.json();
//   console.log(`Fetched ${data.results.length} trending movies.`);
  
//   // Return only the essential data needed for the AI prompt
//   return data.results.map(movie => ({
//     id: movie.id,
//     title: movie.title || movie.name, // Handle both movies and TV shows
//   }));
// }


// /**
//  * Generates homepage content using Google Gemini AI based on a list of movies.
//  * @param {Array<{id: number, title: string}>} movies - The simplified list of movies.
//  * @returns {Promise<{title: string, description: string}>} The AI-generated content.
//  */
// async function generateAIContent(movies) {
//   console.log('Initializing Google Gemini client...');
//   const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//   console.log('Building prompt for Gemini AI...');

//   const prompt = `
//     You are an expert movie blogger creating content for a website's homepage.
//     Based on the following list of trending movies, write an exciting and engaging summary.
//     Movies list: ${JSON.stringify(movies)}

//     Your response MUST be a single, valid JSON object with two keys: "title" and "description".
//     - The "title" should be a catchy headline, at least 50 characters long.
//     - The "description" should be a paragraph of at least 150 characters.
//     - In the description, whenever you mention a movie, wrap its title in an HTML anchor tag.
//     - The link format must be exactly: <a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="/movie/{id}">Movie Title</a>

//     Example Response Format:
//     {
//       "title": "This Week's Hottest Movies & Shows: From Epic Blockbusters to Must-See TV",
//       "description": "Get ready for a cinematic feast! This week's lineup is incredible, featuring the high-octane action of <a class='...' href='/movie/123'>Some Movie</a> and the thrilling mystery in <a class='...' href='/movie/456'>Another Show</a>. Don't miss out!"
//     }

//     IMPORTANT: Return ONLY the raw JSON object. Do not wrap it in markdown (like \`\`\`json).
//   `;

//   console.log('Sending prompt to Gemini AI model...');
//   const result = await model.generateContent(prompt);
//   const text = result.response.text();
//   console.log('Received response from Gemini AI.');

//   try {
//     // Gemini can sometimes wrap the response in markdown, so we clean it just in case.
//     const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();
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
//  * Main function to orchestrate the content generation process.
//  */
// async function main() {
//   console.log('Script started.');
//   console.time('Total Execution Time');

//   const movies = await fetchTrendingMovies();
//   const aiContent = await generateAIContent(movies);
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
//
// generateHomePageContentRunner.js (Complete & Updated Version)
//
import 'dotenv/config'; // Make sure to install dotenv: npm install dotenv
import { connect } from './lib/mongodb/mongoose.js';
import HomePageContent from './lib/models/homePageContent.model.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Configuration ---
// DANGER: Hardcoding API keys is a major security risk.
// Anyone with access to this code can steal and use your keys.
const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

/*
// RECOMMENDED: Use environment variables for security.
// 1. Create a file named ".env" in your project root.
// 2. Add your keys to the .env file like this:
//    TMDB_API_KEY=your_tmdb_key_here
//    GEMINI_API_KEY=your_gemini_key_here
// 3. Use them in your code like this:
// const API_KEY = process.env.TMDB_API_KEY;
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
*/


/**
 * Fetches the weekly trending movies from TMDB and returns a simplified list.
 * @returns {Promise<Array<{id: number, title: string}>>} A list of movies with only id and title.
 */
async function fetchTrendingMovies() {
  console.log('Fetching trending movies from TMDB...');
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.results.length} trending movies.`);
  
  // Return only the essential data needed for the AI prompt
  return data.results.map(movie => ({
    id: movie.id,
    title: movie.title || movie.name, // Handle both movies and TV shows
  }));
}


/**
 * Generates homepage content using Google Gemini AI, ensuring movie titles are linked.
 * @param {Array<{id: number, title: string}>} movies - The simplified list of movies.
 * @returns {Promise<{title: string, description: string}>} The AI-generated content.
 */
async function generateAIContent(movies) {
  console.log('Initializing Google Gemini client...');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('Building prompt for Gemini AI...');

  const prompt = `
    You are an expert movie blogger creating content for a website's homepage.
    Based on the following list of trending movies, write an exciting and engaging summary.
    Movies list: ${JSON.stringify(movies)}

    Your response MUST be a single, valid JSON object with two keys: "title" and "description".
    - The "title" should be a catchy headline, at least 50 characters long.
    - The "description" should be a paragraph of at least 150 characters.

    - **Crucially, in the description, whenever you mention a movie from the list, you MUST wrap its title in an HTML anchor tag with the following format:**
      \`<a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href="/movie/{movieId}">Movie Title</a>\`
      **Replace "{movieId}" with the corresponding 'id' from the movies list.**

    Example: If a movie in the list is { "id": 789, "title": "Awesome Action Movie" }, the link must be:
    \`<a class="..." href="/movie/789">Awesome Action Movie</a>\`

    IMPORTANT: Return ONLY the raw JSON object. Do not wrap it in markdown formatting like \`\`\`json.
  `;

  console.log('Sending prompt to Gemini AI model...');
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log('Received response from Gemini AI.');

  try {
    const cleanedText = text.replace(/`{3}(?:json)?\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error('Raw AI response that failed to parse:', text);
    throw new Error('Failed to parse JSON from Gemini AI response.');
  }
}

/**
 * Saves the generated content to the MongoDB database.
 * @param {{title: string, description: string}} content - The content to save.
 */
async function saveContentToDB(content) {
  console.log('Connecting to MongoDB...');
  await connect();
  console.log('Connected to MongoDB. Saving content...');

  const savedContent = await HomePageContent.findOneAndUpdate(
    { updatedBy: 'github-actions' }, // Find the document to update
    {
      $set: { // Set the new values
        title: content.title,
        description: content.description,
        updatedBy: 'github-actions',
      },
    },
    { new: true, upsert: true } // Options: return the new doc, and create if it doesn't exist
  );

  console.log('Home page content successfully updated in database.');
  return savedContent;
}


/**
 * Main function to orchestrate the content generation process.
 */
async function main() {
  console.log('Script started.');
  console.time('Total Execution Time');

  const movies = await fetchTrendingMovies();
  const aiContent = await generateAIContent(movies);
  await saveContentToDB(aiContent);

  console.timeEnd('Total Execution Time');
}


// --- Script Execution ---
main()
  .then(() => {
    console.log('Generation task completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('An error occurred during the script execution:', error.message);
    process.exit(1);
  });