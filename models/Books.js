import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    published_date : {
        type: Date,
        required: true
    },
    genre: {
        type: [String],
        required: true
    }

}, {timestamps: true})

export const Book = mongoose.model("book", bookSchema);
