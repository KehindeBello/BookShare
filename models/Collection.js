import mongoose, { SchemaType } from "mongoose";
import { User } from "./User.js";
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    books: {
        type: [Schema.Types.ObjectId],
        ref: 'Book'
    }
}, {timestamps: true});

export const Collection = mongoose.model("collection", collectionSchema);