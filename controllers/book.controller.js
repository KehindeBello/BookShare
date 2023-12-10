import { Book } from "../models/Books.js"

export class BookController {

    async all_books(req, res) {
        const page = req.query.page || 1
        const limit = 4
        const skip = (page - 1) * limit

        const username = req.query.username;
        const query = (req.query.username !== undefined) ? {uploaded_by:username} : {}

        try {
            const books = await Book.find(query).sort({createdAt: "desc"}).skip(skip).limit(limit);
            return res.status(200).json({
                message: "Books fetched",
                status: true,
                data: books
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: error.message,
                status: false,
                data : null
            })
        }
    }
 
    async add_book(req, res) {
        console.log(req.session.username);
        try {
            console.log(req.body);
            const uploaded_by = req.session.username

            console.log(`Book uploaded by ${uploaded_by}`);
            
            const book = new Book({...req.body, uploaded_by});
            
            const newBook = await book.save()
            return res.status(201).json({
                message: "Book added!",
                status: true,
                data: newBook
            })            
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async get_book(req, res) {
        try {
            const id = req.params.id;
            const book = await Book.findById(id)
            return res.status(200).json({
                message: "Book fetched",
                status: true,
                data: book
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async delete_book(req,res) { 
        try {
            const id = req.params.id;
            await Book.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Book deleted",
                status: true,
                data: null
            })
        } catch (error) {
            return res.status(400).json({
                message: error.message,
                status: false,
                data : null
            })
        }
    }
}