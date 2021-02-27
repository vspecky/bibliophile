import { Router } from 'express';
import * as authc from '../controllers/auth.controllers';
import * as forumc from '../controllers/forums.controller';
import { body } from 'express-validator';

const router = Router();

const newTopicValidator = [
    body("title")
        .notEmpty()
        .withMessage("Please provide a title")
        .bail()
        .isLength({ min: 1, max: 100 })
        .withMessage("Title can only be a maximum of 100 characters long"),

    body("content")
        .notEmpty()
        .withMessage("Content cannot be empty")
        .bail()
        .isLength({ max: 2000 })
        .withMessage("Content cannot be over 2000 characters long")
];

const newPostValidator = [
    body("content")
        .notEmpty()
        .withMessage("Posts cannot be empty")
        .bail()
        .isLength({ min: 1, max: 2000 })
        .withMessage("Posts cannot be over 2000 characters long")
];

router.route('/').get(
    authc.isSignedIn,
    forumc.getAllTopics
);

router.route('/topic/:id').get(
    authc.isSignedIn,
    forumc.getTopicById
);

router.route('/topic/:id').post(
    authc.isSignedIn,
    newPostValidator,
    forumc.newPost
);

router.route('/like/:id').post(
    authc.isSignedIn,
    forumc.likeTopic
);

router.route('/unlike/:id').post(
    authc.isSignedIn,
    forumc.unlikeTopic
);

router.route('/:id').post(
    authc.isSignedIn,
    newTopicValidator,
    forumc.newTopic
);

export default router;