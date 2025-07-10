"use client";
import { useState } from "react";
import Results from "./Results";

export default function PaginatedResults({
  initialResults,
  initialPage,
  totalPages,
  genre,
}) {
  const [results, setResults] = useState(initialResults);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.API_KEY;
  const loadMore = async () => {
    if (page >= totalPages || loading) return;

    const nextPage = page + 1;
    setLoading(true);

    const res = await fetch(
      `https://api.themoviedb.org/3${
        genre === "rated" ? "/movie/top_rated" : "/trending/all/week"
      }?api_key=${API_KEY}&language=en-US&page=${nextPage}`
    );
    const data = await res.json();

    setResults((prev) => [...prev, ...data.results]);
    setPage(nextPage);
    setLoading(false);
  };

  return (
    <div>
      <Results results={results} />
      {page < totalPages && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
}
