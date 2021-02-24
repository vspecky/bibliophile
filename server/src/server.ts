import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server started on port 5000"));