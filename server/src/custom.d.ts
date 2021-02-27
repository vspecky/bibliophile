interface UserDetails extends Document {
    email: string;
    fname: string;
    lname: string;
    role: number;
    bio: string;
}

declare namespace Express {
    export interface Request {
        user?: UserDetails
    }
}