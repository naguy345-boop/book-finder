import { useState } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a book title.");
      return;
    }
    setError("");
    setLoading(true);
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setBooks(data.docs.slice(0, 20));
      if (data.docs.length === 0) setError("No results found.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCover = (coverId) =>
    coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : null;

  return (
    <div className="container">
      <h1>📚 Book Finder</h1>
      <form onSubmit={searchBooks} className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book.key}>
            <img
              src={
                getCover(book.cover_i) ||
                "https://via.placeholder.com/128x180?text=No+Cover"
              }
              alt={book.title}
            />
            <h3>{book.title}</h3>
            <p>{book.author_name?.join(", ") || "Unknown Author"}</p>
            <p>{book.first_publish_year || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
