// import mongoose from 'mongoose';

// const homePageContentSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     updatedBy: {
//       type: String,
//       required: true,
//       default: 'inngest',
//     },
//   },
//   { timestamps: true }
// );

// const HomePageContent =
//   mongoose.models.HomePageContent ||
//   mongoose.model('HomePageContent', homePageContentSchema);

// export default HomePageContent;
// src/lib/models/homePageContent.model.js

import mongoose from 'mongoose';

// We define a schema for what a single section will look like
const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// The main schema now holds a main title and an ARRAY of sections
const HomePageContentSchema = new mongoose.Schema(
  {
    mainTitle: { type: String, required: true },
    sections: [SectionSchema], // This will hold our different sections
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

const HomePageContent =
  mongoose.models.HomePageContent ||
  mongoose.model('HomePageContent', HomePageContentSchema);

export default HomePageContent;