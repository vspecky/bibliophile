import Genre, { IGenre } from '../../models/genre.model';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const getAllGenres = async (_: Request, res: Response) => {
    Genre.find()
        .then(async (docs: IGenre[]) => {
            res.json(docs);
        })
        .catch(async () => res.status(500).json({
            msg: "Internal server error"
        }));
};

export const addGenre = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const genre = new Genre({
        name: req.body.name
    });

    genre.save()
        .then(async (doc: IGenre) => res.json(doc))
        .catch(async _ => res.status(500).json({
            msg: "Internal server error"
        }));
};