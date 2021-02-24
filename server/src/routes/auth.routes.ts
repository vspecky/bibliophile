import { Router, Request, Response } from 'express';
import * as authc from './controllers/auth.controllers';
import { body } from 'express-validator';

const router = Router();

router.post('/register', [
    body("email", "Please enter a valid email")
        .normalizeEmail()
        .isEmail(),

    body("password", "Please enter a valid password")
        .isLength({ min: 4, max: 16 }),

    body("fname", "Please enter your first name")
        .notEmpty(),

    body("lname", "Please enter your last name")
        .notEmpty(),

    body("phone", "Please enter a valid phone number")
        .notEmpty()
        .isNumeric()
        .isLength({ min: 10, max: 11 }),

    body("bio", "Bio can only be 2000 characters long")
        .isLength({ min: 0, max: 2000 })
], authc.register);

router.post('/signin', [
    body("email", "Please provide a valid email")
        .normalizeEmail()
        .isEmail(),

    body("password")
        .notEmpty(),

], authc.signin);

router.get('/getuser', authc.checkAuth, async (req: Request, res: Response) => {
    res.json(req.user);
});

export default router;