import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    passhash: string;
    fname: string;
    lname: string;
    phone: string;
    bio: string;
    role: number;

    validatePassword(pass: String): boolean;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passhash: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

userSchema
    .virtual("fullName")
    .get(function(this: IUser) {
        return `${this.fname} ${this.lname}`;
    });

const SALTS = process.env.SALTS || 10;
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified("passhash")) {
        const newHash = bcrypt.hashSync(this.passhash, SALTS);
        this.passhash = newHash;
    }

    next();
});

userSchema.methods.validatePassword = function(pass: string) {
    return bcrypt.compareSync(pass, this.passhash);
}

export default model<IUser>("User", userSchema);