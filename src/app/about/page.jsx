export default function About() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-4 text-center">
          <h1 className="text-3xl font-semibold my-4">About MovieMeter</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to <strong>MovieMeter</strong>! We provide a rich database of movies
              and TV shows, offering detailed insights into your favorite content.
              Whether you're a cinephile or a casual viewer, MovieMeter enhances
              your entertainment journey.
            </p>
  
            <p>
              Our platform lets you explore cast & crew, read plot summaries,
              discover user reviews, check ratings, and track your watchlist
              with ease. We stay current with the latest releases and trending titles
              so you'll never miss a buzzworthy film or series.
            </p>
  
            <p>
              Built with <strong>Next.js</strong> and powered by{' '}
              <a
                href="https://clerk.com/?utm_source=chatgpt"
                target="_blank"
                rel="noreferrer"
                className="text-teal-500 hover:underline"
              >
                Clerk
              </a>{' '}
              for authentication, MovieMeter helps you sign in securely and save your
              personal movie selections and preferences.
            </p>
  
            <p>
              We invite you to rate, review, and favorite the movies and shows you
              love. Your ratings and feedback empower fellow users to discover
              hidden gems and enhance our collective movie-watching experience. Enjoy
              exploring MovieMeter!!
            </p>
          </div>
        </div>
      </div>
    );
  }
