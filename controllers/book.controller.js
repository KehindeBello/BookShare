import { Book } from "../models/Books.js"
import { logger } from "../utils/jwt_utils.js"

export class BookController {

    async all_books(req, res) {
        const page = req.query.page || 1
        const limit = 4
        const skip = (page - 1) * limit
        // query book by username
        const username = req.query.username;
        const query = (req.query.username !== undefined) ? {uploaded_by:username} : {}

        // TODO Query based on the presence of other parameters

        try {
            const books = await Book.find(query).sort({createdAt: "desc"}).skip(skip).limit(limit);
            logger.info("All books fetched!")

            return res.status(200).json({
                message: "Books fetched",
                status: true,
                data: books
            }) 
        } catch (error) {
            logger.error(error);
            return res.status(400).json({
                message: error.message,
                status: false,
                data : null
            })
        }
    }
 
    async add_book(req, res) {
        try {
            logger.info(JSON.stringify(req.body)); 
            const uploaded_by = req.user.username
            
            const book = new Book({...req.body, uploaded_by});
            const newBook = await book.save()

            logger.info(`${book.title} uploaded by ${uploaded_by}`)

            return res.status(201).json({
                message: "Book added!",
                status: true,
                data: newBook
            })            
        } catch (error) {
            logger.error(`Add Book error - ${error.message}`)
            return res.status(400).json({
                message: error.message,
                status: false,
                data: null
            })
        }
    }

    async get_book(req, res) {
        const id = req.params.id;

        try {
            const book = await Book.findById(id);
            logger.info(`${book.title} fetched!`);

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
        const id = req.params.id;
        
        try {
            // does the book exist
            const book = await Book.findById({_id : id});
            if (!book) {
                return res.status(400).json({message: "Book not found!"})
            } 
            //delete the book
            await Book.findByIdAndDelete(id);
            logger.info(`${book.title} deleted by ${req.user.username}`)

            return res.status(200).json({
                message: "Book deleted",
                status: true,
                data: null
            })
        } catch (error) {
            logger.error(`Error deleting book: ${error.message}`)
            return res.status(400).json({
                message: error.message,
                status: false,
                data : null
            })
        }
    }
}