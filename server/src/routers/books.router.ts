import { Router } from 'express';
import { body } from 'express-validator';
import * as authc from '../controllers/auth.controllers';
import * as booksc from '../controllers/books.controllers';

const router = Router();

const bookFormValidation = [
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
        .isNumeric(),

];

/* CREATE */
// Route to add a book. Fails if the user is not signed in;
router.route('/add').post(
    authc.isSignedIn,
    bookFormValidation,
    booksc.addBook
);

/* READ */
// Route to get all books irrespective of user;
router.route('/').get(
    authc.isSignedIn,
    booksc.allBooks
);
// Route to get all books posted by the current user;
router.route('/mine').get(
    authc.isSignedIn,
    booksc.allBooksByUser
);
// Route to get a specific book by the current user;
router.route('/:id').get(
    authc.isSignedIn,
    booksc.oneBookById
);

/* UPDATE */
// Route to update a specific book by the current user;
router.route('/update/:id').post(
    authc.isSignedIn,
    bookFormValidation,
    booksc.updateBookById
);

export default router;