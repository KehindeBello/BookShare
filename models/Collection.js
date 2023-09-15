import mongoose, { SchemaType } from "mongoose";
import { User } from "./User";
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    user_id: {
        type: User._id,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    books: [{
        type: [Schema.Types.ObjectId],
        ref: 'Book'
    }]
}, {timestamps: true});

export const Collection = mongoose.model("collectionModel", collectionSchema);