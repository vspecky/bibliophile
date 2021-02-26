import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/user.model';
import { CallbackError } from 'mongoose';
import jwt, { VerifyErrors } from 'jsonwebtoken';


/**
 * Controller to register a new user. First checks if a user with the provided email already
 * exists. If yes then returns a 400, else creates the user and saves the details to the DB
 *
 * @param {Request} req
 * @param {Response} res
 * @return {void} 
 */
export const register = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    User.findOne({ email: req.body.email }, (err: CallbackError, doc: IUser | null) => {
        if (err) {
            console.error(err);
            res.status(500).json({ msg: "Internal Server Error" });
            return;
        }

        if (doc) {
            res.status(400).json({ msg: "User already exists" });
            return;
        }

        const j = req.body;
        const newUser = new User({
            email: j.email,
            passhash: j.password,
            fname: j.fname,
            lname: j.lname,
            phone: j.phone,
            bio: j.bio,
            role: 0
        });

        newUser.save()
            .then(() => res.sendStatus(202))
            .catch(err => res.status(400).json(err));
    });
};

/**
 * Controller to sign in a user. Performs some form validation, finds the user in the database.
 * If user is not found, returns a 400. If user is found, 
 *
 * @param {Request} req
 * @param {Response} res
 * @return {*} 
 */
export const signIn = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    User.findOne({ email: req.body.email }, (err: CallbackError, doc: IUser | null) => {
        if (err) {
            res.status(500).json({ msg: "Internal Server Error" });
            return;
        }

        if (!doc) {
            res.status(400).json({ msg: "User not found" });
            return;
        }

        doc.validatePassword(req.body.password, async (err, same) => {
            if (err) {
                res.status(500).json({ msg: "Internal Server Error" });
                return;
            }

            if (!same) {
                res.status(400).json({ msg: "Incorrect Password" });
                return;
            }

            const secret = process.env.SECRET || "somesecret";
            const payload = {
                email: doc.email,
                fname: doc.fname,
                lname: doc.lname,
                role: doc.role,
                bio: doc.bio,
                id: doc._id,
            };
            const token = jwt.sign(payload, secret);

            res.cookie('token', token, {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                path: '/'
            }).sendStatus(200);
        });
    });
};


/**
 * Controller to sign out a user that is currently signed in. if the user is not signed in,
 * sends a 401
 *
 * @param {Request} req
 * @param {Response} res
 * @return {Promise<void>} 
 */
export const signOut = async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ msg: "You are not signed in" });
        return;
    }

    res.clearCookie('token', { httpOnly: true, path: '/' })
        .sendStatus(200);
};

/**
 * Intermediate Controller to check if a user is signed in.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<void>} 
 */
export const isSignedIn = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ msg: "You are not signed in" });
        return;
    }

    const secret = process.env.SECRET || "somesecret";
    jwt.verify(token, secret, (err: VerifyErrors | null, decoded: object | undefined ) => {
        if (err) {
            res.status(401).json({ msg: "Invalid Token" });
            return;
        }

        if (!decoded) {
            res.status(401).json({ msg: "User not signed in" });
            return;
        }

        const { iat, ...rest } = decoded as any;

        req.user = rest;

        next();
    });
};

/**
 * Intermediate Controller to check if user is an admin.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {Promise<void>} 
 */
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ msg: "Only admins can do that" });
        return;
    }

    if (req.user.role !== 1) {
        res.status(403).json({ msg: "Only admins can do that" });
        return;
    }

    next();
};