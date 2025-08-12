import React, { useState, useEffect } from 'react';
import BookList from './components/booklist-frontend/BookList';
import BookDetails from './components/booklist-frontend/BookDetails';
import ReviewForm from './components/booklist-frontend/ReviewForm';
function App() {
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  return (
    <div>
      <h1>📚 Book List</h1>
      <BookList books={books} onSelect={setSelected} />
      {selected && <BookDetails book={selected} />}
    </div>
  );
}

export default App;
