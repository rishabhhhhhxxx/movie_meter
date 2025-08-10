import 'dotenv/config';
import { connect } from './lib/mongodb/mongoose.js';
import HomePageContent from './lib/models/homePageContent.model.js';

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY="8cb6d0c490da58fb0e6eda6dc8338f67";
const GEMINI_API_KEY = "AIzaSyBM_asCEIa6UNlgL8R0JGzyWQSNPxM7Br8";

async function generateHomePageContent() {
  console.log('Starting Google Gemini client setup...');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('Google Gemini client ready.');

  console.log('Fetching trending movies from TMDB...');
  const trendingMoviesResults = await fetch(
    `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US&page=1`
  )
    .then((res) => {
      console.log('TMDB fetch response status:', res.status);
      if (!res.ok) throw new Error('Failed to fetch data');
      return res.json();
    })
    .then((data) => {
      console.log('Fetched trending movies count:', data.results.length);
      return data.results;
    });
  
  console.log('Building prompt for Gemini AI...');
  const prompt = `
    Analyze these movies ${JSON.stringify(
      trendingMoviesResults
    )} and provide a title and description in ONLY the following JSON format without any additional notes or explanations (add a link for each movie with this address '/movie/{movieId}' with html format like this: <a class="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline" href='/movie/{movieId}'>Movie Title</a>):
    {
      "title": "exciting title about new trending movies",
      "description": "exciting description about new trending movies"
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes.
    Include at least 150 characters for description.
    Include at least 50 characters for title.
  `;

  console.log('Sending prompt to Gemini AI model...');
  const googleGeminiResults = await model.generateContent(prompt);
  console.log('Received response from Gemini AI.');

  const text =
    googleGeminiResults.response.candidates[0].content.parts[0].text || '';
  console.log('Raw Gemini AI response text:', text.substring(0, 200), '...');

  const cleanedText = text.replace(/```(?:json)?\n?/g, '').trim();
  console.log('Cleaned response text:', cleanedText.substring(0, 200), '...');

  let homePageContentFromGoogleGemini;
  try {
    homePageContentFromGoogleGemini = JSON.parse(cleanedText);
    console.log('Parsed Gemini AI response JSON:', homePageContentFromGoogleGemini);
  } catch (err) {
    console.error('Failed to parse JSON from Gemini AI response:', err);
    throw err; // rethrow to be caught in the main catch
  }

  console.log('Connecting to MongoDB...');
  await connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  console.log('Saving home page content to database...');
  const saved = await HomePageContent.findOneAndUpdate(
    { updatedBy: 'github-actions' },
    {
      $set: {
        title: homePageContentFromGoogleGemini.title,
        description: homePageContentFromGoogleGemini.description,
        updatedBy: 'github-actions',
      },
    },
    { new: true, upsert: true }
  );
  console.log('Home page content updated:', saved);
}

console.log('Script started');

generateHomePageContent()
  .then(() => {
    console.log('Generation task completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error generating home page content:', error);
    process.exit(1);
  });

console.log('Script ended');
