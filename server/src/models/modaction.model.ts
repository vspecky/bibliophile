import { Schema, model, Document } from 'mongoose';
import { IPost, ITopic } from './topic.model';
import { IBook } from './book.model';
import { IUser } from './user.model';

export interface IModAction extends Document {
    actionType: string;
    document: IPost | ITopic | IBook | IUser;
    reason: string;
}

const modActionSchema = new Schema<IModAction>({
    actionType: {
        type: String,
        required: true,
        enum: ['post', 'topic', 'book', 'user'],
    },
    document: {
        type: Schema.Types.Mixed,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export default model<IModAction>("ModAction", modActionSchema);