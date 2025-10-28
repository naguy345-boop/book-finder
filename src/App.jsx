import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${query}`
    );
    const data = await response.json();
    setBooks(data.docs.slice(0, 12));
    setLoading(false);
  };

  const openModal = async (book) => {
    const response = await fetch(
      `https://openlibrary.org${book.key}.json`
    );
    const details = await response.json();
    setSelectedBook({ ...book, ...details });
  };

  const closeModal = () => setSelectedBook(null);

  return (
    <div className="app-container">
      <header>
        <h1>
          📚 <span>Book Finder</span>
        </h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={searchBooks}>Search</button>
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading books...</p>
      ) : (
        <div className="book-grid">
          {books.map((book, index) => (
            <div
              key={index}
              className="book-card"
              onClick={() => openModal(book)}
            >
              <img
                src={
                  book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                    : "https://via.placeholder.com/150x220?text=No+Cover"
                }
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <p className="author">
                {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
              </p>
              <p className="year">{book.first_publish_year}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Book Details */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            <img
              src={
                selectedBook.cover_i
                  ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
                  : "https://via.placeholder.com/200x300?text=No+Cover"
              }
              alt={selectedBook.title}
            />
            <h2>{selectedBook.title}</h2>
            <p className="author">
              {selectedBook.authors
                ? selectedBook.authors.map((a) => a.name).join(", ")
                : selectedBook.author_name
                ? selectedBook.author_name.join(", ")
                : "Unknown Author"}
            </p>
            <p className="year">Published: {selectedBook.first_publish_year || "N/A"}</p>
            <p className="desc">
              {selectedBook.description
                ? typeof selectedBook.description === "string"
                  ? selectedBook.description
                  : selectedBook.description.value
                : "No description available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
