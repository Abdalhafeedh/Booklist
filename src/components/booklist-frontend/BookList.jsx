function BookList({ books, onSelect }) {
  return (
    <div>
      {books.map(book => (
        <div key={book.id} onClick={() => onSelect(book)}>
          <h3>{book.title}</h3>
          <p>Author: {book.author} | Rating: {book.rating}</p>
        </div>
      ))}
    </div>
  );
}
export default BookList;
