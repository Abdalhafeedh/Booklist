// Import necessary modules
import express from 'express'; // This is our web server framework
import fs from 'fs/promises'; // This is Node.js's built-in file system module, used to read our data.json file

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: This is a function that runs for every incoming request.
// It allows Express to automatically parse JSON data from the body of a request.
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
// This is important for the frontend to be able to make requests to the backend,
// even though they are running on different "origins" (localhost:3000 vs localhost:5000).
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// A small utility function to save data back to the file
const saveBooks = async (booksData) => {
    try {
        await fs.writeFile('./data.json', JSON.stringify(booksData, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing to file:', err);
    }
};

// GET /books: Get a list of all books
app.get('/books', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        const books = JSON.parse(data);
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).send('Internal Server Error');
    }
});

// GET /books/:id: Get details for a single book
app.get('/books/:id', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        const books = JSON.parse(data);
        const book = books.find(b => b.id == req.params.id);
        res.json(book || {});
    } catch (err) {
        console.error('Error fetching book details:', err);
        res.status(500).send('Internal Server Error');
    }
});

// POST /books/:id/reviews: Add a new review to a book
app.post('/books/:id/reviews', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        const books = JSON.parse(data);
        const book = books.find(b => b.id == req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const { name, comment, stars } = req.body;
        if (!name || !comment || !stars) {
            return res.status(400).send('Name, comment, and stars are required.');
        }

        const newReview = {
            id: Date.now(), // A simple way to generate a unique ID
            name,
            comment,
            stars
        };
        book.reviews.push(newReview);
        await saveBooks(books);
        res.status(201).json(newReview);
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).send('Internal Server Error');
    }
});

// PUT /books/:id/reviews/:reviewId: Update an existing review
app.put('/books/:id/reviews/:reviewId', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        const books = JSON.parse(data);
        const book = books.find(b => b.id == req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const review = book.reviews.find(r => r.id == req.params.reviewId);
        if (!review) {
            return res.status(404).send('Review not found');
        }

        const { name, comment, stars } = req.body;
        if (name) review.name = name;
        if (comment) review.comment = comment;
        if (stars) review.stars = stars;
        
        await saveBooks(books);
        res.json(review);
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE /books/:id/reviews/:reviewId: Delete a review
app.delete('/books/:id/reviews/:reviewId', async (req, res) => {
    try {
        const data = await fs.readFile('./data.json', 'utf-8');
        let books = JSON.parse(data);
        const book = books.find(b => b.id == req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const initialReviewCount = book.reviews.length;
        book.reviews = book.reviews.filter(r => r.id != req.params.reviewId);
        if (book.reviews.length === initialReviewCount) {
             return res.status(404).send('Review not found');
        }

        await saveBooks(books);
        res.sendStatus(204); // 204 means 'No Content', which is a standard response for a successful deletion
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
