import React, { useState, useEffect } from 'react';

function ReviewForm({ bookId, existingReview, onSave }) {
  const [name, setName] = useState('');
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (existingReview) {
      setName(existingReview.name);
      setStars(existingReview.stars);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = existingReview ? 'PUT' : 'POST';
    const url = existingReview
      ? `http://localhost:5000/books/${bookId}/reviews/${existingReview.id}`
      : `http://localhost:5000/books/${bookId}/reviews`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, stars, comment }),
    });

    if (response.ok) {
      const data = await response.json();
      onSave(data); // Notify parent to refresh
      setName('');
      setStars(5);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{existingReview ? 'Edit' : 'Add'} Review</h3>
      <input
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <br />
      <input
        type="number"
        min="1"
        max="5"
        value={stars}
        onChange={e => setStars(Number(e.target.value))}
        required
      /> ⭐
      <br />
      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        required
      />
      <br />
      <button type="submit">{existingReview ? 'Update' : 'Submit'} Review</button>
    </form>
  );
}

export default ReviewForm;
