import { Request, Response } from 'express';
import * as globals from '../globals';
import Topic from '../models/topic.model';

export const deleteTopicOrPost = async (req: Request, res: Response) => {
    const topicID = req.params.id;
    const postID = req.query.postid;

    if (!postID) {
        Topic.findByIdAndDelete(topicID)
            .exec(async (err, _) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(globals.INTERNAL_SERVER_ERROR);
                    return;
                }

                res.sendStatus(200);
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
    .exec(async (err, _) => {
        if (err) {
            console.error(err);
            res.status(500).json(globals.INTERNAL_SERVER_ERROR);
            return;
        }

        res.sendStatus(200);
    });
};