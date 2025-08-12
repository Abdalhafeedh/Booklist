function BookDetails({ book }) {
  return (
    <div>
      <h2>{book.title} by {book.author}</h2>
      <h4>Reviews:</h4>
      {book.reviews.map(r => (
        <div key={r.id}>
          ⭐ {r.stars} - {r.comment} by {r.name}
        </div>
      ))}
    </div>
  );
}
export default BookDetails;
