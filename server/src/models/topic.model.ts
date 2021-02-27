import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
    user: Schema.Types.ObjectId;
    content: string;
}

export interface ITopic extends Document {
    user: Schema.Types.ObjectId;
    genre: Schema.Types.ObjectId;
    title: string;
    posts: Array<IPost>;
    likes: number;
    likedUsers: Array<Schema.Types.ObjectId>;
}

const postSchema = new Schema<IPost>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 2000,
    },
}, {
    timestamps: true
});

const topicSchema = new Schema<ITopic>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: "Genre",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100,
    },
    posts: [postSchema],
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    likedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
});

export default model<ITopic>("Topic", topicSchema);