import Book, { IBook } from '../../models/book.model';
import { Request, Response } from 'express';
import { CallbackError } from 'mongoose';
import { validationResult } from 'express-validator';

export const allbooks = async (_: Request, res: Response) => {
    Book.find()
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
        .exec((err: CallbackError, doc: IBook[]) => {
            if (err) {
                res.status(500).json({ msg: "Internal server error" });
                return;
            }

            res.json(doc);
        });
};

export const addbook = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const j = req.body;
    const user = req.user as any;
    const book = new Book({
        user: user.id,
        name: j.name,
        author: j.author,
        description: j.description,
        genre1: j.genre1,
        genre2: j.genre2,
        age: j.age,
        isbn: j.isbn,
        price: j.price
    });

    book.save()
        .then(doc => res.json(doc.toJSON()))
        .catch(msg => res.status(500).json({ msg }));
}