import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Topic from '../models/topic.model';
import * as globals from '../globals';

export const newTopic = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const j = req.body;
    const genre = req.params.id as string;
    const user = req.user as any;

    const topic = new Topic({
        user: user.id,
        genre: genre,
        title: j.title,
        posts: [{
            user: user.id,
            content: j.content,
            likes: 0,
            likedUsers: [],
        }],
        likes: 0,
        likedUsers: []
    });

    topic.save()
        .then(_ => res.sendStatus(201))
        .catch(err => {
            console.error(err);
            res.status(500).json(globals.INTERNAL_SERVER_ERROR);
        });
};

export const newPost = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const post = {
        user: (req.user as any).id,
        content: req.body.content,
        likes: 0,
        likedUsers: []
    };

    Topic.findByIdAndUpdate(req.params.id, {
        $push: {
            posts: post
        }
    })
    .then(async _ => res.sendStatus(201))
    .catch(async err => {
        console.error(err);
        res.status(500).json(globals.INTERNAL_SERVER_ERROR);
    });
}

export const getAllTopics = async (_: Request, res: Response) => {
    Topic.find()
        .exec(async (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                return;
            }

            res.json(doc);
        });
};

export const getTopicById = async (req: Request, res: Response) => {
    Topic.findById(req.params.id)
        .exec(async (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                return;
            }

            res.json(doc);
        });
};

export const likeTopic = async (req: Request, res: Response) => {
    Topic.findById(req.params.id)
        .exec(async (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                return;
            }

            if (!doc) {
                res.sendStatus(404);
                return;
            }

            const liked = doc.likedUsers.some(user => {
                return user.toString() === (req.user as any).id;
            });

            if (liked) {
                res.sendStatus(403);
                return;
            }

            doc.likes++;
            doc.likedUsers.push((req.user as any).id);

            doc.save()
                .then(async _ => res.sendStatus(200))
                .catch(async err => {
                    console.error(err);
                    res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                });
        });
};

export const unlikeTopic = async (req: Request, res: Response) => {
    Topic.findById(req.params.id)
        .exec(async (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                return;
            }

            if (!doc) {
                res.sendStatus(404);
                return;
            }

            const liked = doc.likedUsers.some(user => {
                return user.toString() === (req.user as any).id;
            });

            if (!liked) {
                res.sendStatus(403);
                return;
            }

            doc.likes--;
            doc.likedUsers = doc.likedUsers.filter(
                u => u.toString() !== (req.user as any).id
            );

            doc.save()
                .then(async _ => res.sendStatus(200))
                .catch(async err => {
                    console.error(err);
                    res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                });
        });
};