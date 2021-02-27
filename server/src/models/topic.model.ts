import { Schema, model, Document } from 'mongoose';

interface ITopic extends Document {
    user: Schema.Types.ObjectId;
    genre: Schema.Types.ObjectId;
    title: string;
    likes: number;
}

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
    likes: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true
});

export default model<ITopic>("Topic", topicSchema);