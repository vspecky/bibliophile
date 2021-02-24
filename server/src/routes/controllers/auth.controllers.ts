import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../../models/user.model';
import { CallbackError } from 'mongoose';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(400).json(result.array()[0]);
        return;
    }

    const existing = await User.findOne({ email: req.body.email });

    if (existing) {
        res.status(400).json("User already exists");
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
        .then(() => res.json("User created successfully"))
        .catch(err => res.status(400).json(err));
};

export const signin = async (req: Request, res: Response) => {
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

        if (!doc.validatePassword(req.body.password)) {
            res.status(400).json({ msg: "Incorrect password" });
            return;
        }

        const secret = process.env.SECRET || "somesecret";
        const payload: UserDetails = {
            email: doc.email,
            fname: doc.fname,
            lname: doc.lname,
            role: doc.role,
            bio: doc.bio,
        };
        const token = jwt.sign(payload, secret);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        }).sendStatus(200);
    });
};

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
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
}

export default {};