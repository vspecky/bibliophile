import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
    user: Schema.Types.ObjectId;
    name: string;
    author: string;
    description: string;
    genre1: Schema.Types.ObjectId;
    genre2: Schema.Types.ObjectId;
    age: number;
    isbn: string;
};

const bookSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000,
    },
    genre1: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
    },
    genre2: {
        type: Schema.Types.ObjectId,
        ref: "Genre"
    },
    age: {
        type: Number,
        required: true,
    },
    isbn: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

export default model<IBook>("Book", bookSchema);