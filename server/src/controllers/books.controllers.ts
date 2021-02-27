import Book, { IBook } from '../models/book.model';
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { validationResult } from 'express-validator';

/**
 * Controller to add a book from a user if they're signed in
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>} 
 */
export const addBook = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const j = req.body;
    const user = req.user as any;
    const genres = [];
    for (const genre of [j.genre1, j.genre2]) {
        if (genre !== "None") genres.push(genre);
    }
    const book = new Book({
        user: user.id,
        name: j.name,
        author: j.author,
        description: j.description,
        genre: genres,
        age: j.age,
        isbn: j.isbn,
        price: j.price
    });

    book.save()
        .then(_ => res.sendStatus(201))
        .catch(msg => res.status(500).json({ msg }));
};

/**
 * Controller to get all books irrespective of the user. Can also filter
 * books by genre.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const allBooks = async (req: Request, res: Response) => {
    const genresStr = req.query.genres as string ?? '';

    (!Boolean(genresStr)
        ? Book.find()
        : Book.find({ genre: { $in: genresStr.split(' ') } }))
        .populate([
            {
                path: 'user',
                model: 'User',
                select: [
                    '_id', 'fname', 'lname'
                ]
            },
            {
                path: 'genre',
                model: 'Genre',
            },
        ])
        .exec(async (err: CallbackError, doc: IBook[]) => {
            if (err) {
                console.error(err);
                res.status(500).json({ msg: "Internal server error" });
                return;
            }

            res.json(doc);
        });
};

/**
 * Controller to get the books posted by a particular user.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const allBooksByUser = async (req: Request, res: Response) => {
    Book.find({ user: (req.user as any).id })
        .populate([
            {
                path: 'user',
                model: 'User',
                select: [
                    '_id', 'fname', 'lname'
                ]
            },
            {
                path: 'genre1',
                model: 'Genre',
            },
            {
                path: 'genre2',
                model: 'Genre'
            }
        ])
        .exec(async (err: CallbackError, doc: IBook[]) => {
            if (err) {
                res.status(500).json({ msg: "Internal Server Error" });
                return;
            }

            res.status(201).json(doc);
        });
};

/**
 * Get a book posted by the current user through its id. Fails if the
 * book referenced does not belong to the current user.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const oneBookById = async (req: Request, res: Response) => {
    const id = req.params.id;

    Book.findById(id)
        .populate([
            {
                path: 'user',
                model: 'User',
                select: [
                    '_id', 'fname', 'lname'
                ]
            },
            {
                path: 'genre1',
                model: 'Genre',
            },
            {
                path: 'genre2',
                model: 'Genre'
            }
        ])
        .exec(async (err: CallbackError, doc: IBook | null) => {
            if (err) {
                res.status(500).json({ msg: "Internal Server Error" });
                return;
            }

            if (!doc) {
                res.sendStatus(404);
                return;
            }

            res.status(201).json(doc);
        });
};

/**
 * Controller to update the details of a book posted by the current user
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>} 
 */
export const updateBookById = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const id = req.params.id;
    Book.findById(id, async (err: CallbackError, doc: IBook | null) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Internal Server Error" });
            return;
        }

        if (!doc) {
            res.sendStatus(404);
            return;
        }

        if (doc.user.toString() !== (req.user as any).id) {
            res.sendStatus(403);
            return;
        }

        const j = req.body;
        const genres = [];
        for (const genre of [j.genre1, j.genre2]) {
            if (genre !== "None") genres.push(genre);
        }
        doc.name = j.name;
        doc.author = j.author;
        doc.description = j.description;
        doc.genre = genres;
        doc.age = j.age;
        doc.isbn = j.isbn;
        doc.price = j.price;
        
        doc.save()
            .then(async _ => res.sendStatus(200))
            .catch(async err => {
                console.error(err);
                res.status(500).json({ msg: "Internal Server Error" });
            });
    });
}