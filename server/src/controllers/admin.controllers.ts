import { Request, Response } from 'express';
import * as globals from '../globals';
import ModAction from '../models/modaction.model';
import Topic from '../models/topic.model';
import Book from '../models/book.model';

export const deleteTopicOrPost = async (req: Request, res: Response) => {
    const topicID = req.params.id;
    const postID = req.query.postid;
    const reason = req.query.reason;

    if (!postID) {
        Topic.findByIdAndDelete(topicID)
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

                const modAction = new ModAction({
                    actionType: "topic",
                    document: doc,
                    reason,
                });

                modAction.save()
                    .then(async final => res.status(204).json(final))
                    .catch(async err => {
                        console.error(err);
                        res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                    });
            });

        return;
    }

    Topic.findByIdAndUpdate(topicID, {
        $pull: {
            posts: {
                _id: postID
            }
        }
    })
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

        if (doc.posts.length > 0 && doc.posts[0]._id.toString() === postID) {
            const modAction = new ModAction({
                actionType: "topic",
                document: doc,
                reason,
            });

            modAction.save()
                .then(async final => res.status(204).json(final))
                .catch(async err => {
                    console.error(err);
                    res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                });

            return;
        }

        const post = doc.posts.find(p => p._id.toString() === postID);

        const modAction = new ModAction({
            actionType: "post",
            document: post,
            reason,
        });

        modAction.save()
            .then(async final => res.status(204).json(final))
            .catch(async err => {
                console.error(err);
                res.status(500).json(globals.INTERNAL_SERVER_ERROR);
            });
    });
};

export const deleteBook = async (req: Request, res: Response) => {
    const bookID = req.params.id; 
    const reason = req.query.reason;

    if (!reason) {
        res.status(400).json({ msg: "No reason given" });
        return;
    }

    Book.findByIdAndDelete(bookID)
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

            const modAction = new ModAction({
                actionType: "book",
                document: doc,
                reason,
            });

            modAction.save()
                .then(async final => res.status(204).json(final))
                .catch(async err => {
                    console.error(err);
                    res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                });
        });
};