# 🎬 MovieMeter – AI-Powered Movie App

An **AI-powered movie discovery platform** built with **Next.js 15** that delivers a personalized movie browsing experience.  
It integrates **Google Gemini** for AI-curated content, **Clerk** for authentication, and **MongoDB** for persistent user data.  

🔗 **Live Demo:** [movie-meter-zeta.vercel.app](https://movie-meter-zeta.vercel.app)

---

## 🚀 Features
- 🤖 **AI-Curated Homepage** – Automated weekly content pipeline using GitHub Actions + Google Gemini  
- 🔐 **User Authentication** – Secure login and profile management with Clerk webhooks  
- ❤️ **Favorites List** – Persistent personalized movie tracking in MongoDB  
- 🔎 **Movie Browsing** – Fully paginated pages for **Trending**, **Top Rated**, and **Search Results**  
- 🎥 **Movie Detail Pages** – Feature-rich SSR pages with:
  - AI insights ("Vibe Checks")  
  - Embedded trailers  
  - Dynamic cast & recommendations  

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)  
- **Database:** MongoDB  
- **Authentication:** Clerk (with webhooks)  
- **AI Integration:** Google Gemini  
- **CI/CD:** GitHub Actions (scheduled homepage content generation)  
- **Styling:** Tailwind CSS  

---

## 📂 Project Structure
movie-meter/
├── src/
│ ├── app/ # Next.js App Router pages & layouts
│ ├── components/ # Reusable UI components
│ ├── lib/ # Utils (API calls, helpers, Gemini integration)
│ ├── models/ # MongoDB schemas
│ └── styles/ # Global styles
├── .github/workflows/ # GitHub Actions workflow for content pipeline
├── public/ # Static assets
└── README.md # Project documentation

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/movie-meter.git
cd movie-meter

npm install

Create a .env.local file in the root directory with:

MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret

GEMINI_API_KEY=your_google_gemini_api_key

npm run dev
