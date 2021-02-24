import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes';
import booksRouter from './routes/books.routes';
import genresRouter from './routes/genres.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const DB_URI = process.env.DB_URI || "mongodb://localhost/bibliophile";
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log("Connected to the database");
});

app.get('/', (_, res) => {
    res.send("Working");
});

app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/genres', genresRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server started on port 5000"));