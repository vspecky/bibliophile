import { Schema, model, Document } from 'mongoose';

interface IGenre extends Document {
    name: string;
};

const genreSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

export default model<IGenre>("Genre", genreSchema);