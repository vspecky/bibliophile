import { Schema, model, Document } from 'mongoose';

export interface IPost extends Document {
    user: Schema.Types.ObjectId;
    topic: Schema.Types.ObjectId;
    content: string;
    likes: number;
}

const postSchema = new Schema<IPost>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 2000,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
});

export default model<IPost>("Post", postSchema);