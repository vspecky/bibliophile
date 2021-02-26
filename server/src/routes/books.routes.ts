import { Router } from 'express';
import { body } from 'express-validator';
import * as authc from '../controllers/auth.controllers';
import * as booksc from '../controllers/books.controllers';

const router = Router();

router.get('/', authc.isSignedIn, booksc.allbooks);

router.post('/add', authc.isSignedIn, [
    body("name", "Please enter the name of the book (Max. 200 characters)")
        .notEmpty()
        .isLength({ min: 1, max: 200 }),

    body("author", "Please enter the name of the author (Max. 200 characters)")
        .notEmpty()
        .isLength({ min: 1, max: 200 }),

    body("description", "Description can be at max 2000 characters")
        .notEmpty()
        .isLength({ min: 0, max: 2000 }),

    body("genre1", "Please enter a genre")
        .notEmpty(),

    body("genre2", "Please enter a genre")
        .notEmpty(),

    body("age", "Age must be a number")
        .isNumeric(),

    body("isbn", "Please enter a valid ISBN")
        .isLength({ min: 13, max: 13 }),

    body("price", "Please enter a valid price")
        .isNumeric()

], booksc.addbook);

export default router;