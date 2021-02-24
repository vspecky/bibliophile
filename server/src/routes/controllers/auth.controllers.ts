import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../../models/user.model';

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

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(400).json({ msg: "User does not exist" });
        return;
    }

    if (user.validatePassword(req.body.password)) {
        res.json("authenticated");
    } else {
        res.json("wrong password");
    }
};

export default {};