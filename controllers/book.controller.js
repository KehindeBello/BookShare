import { Book } from "../models/Books.js"

export class BookController {

    all_books(req, res) {
        const page = req.query.page || 0
        const bookPerPage = 3
        Book.find().sort({createdAt: "desc"})
        .skip(page * bookPerPage)
        .limit(bookPerPage)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    add_book(req, res) {
        const book = new Book(req.body);
        book.save()
            .then((result) => {
                res.redirect('/books')
            })
            .catch((err) => {
                console.log(err);
            })
    }

    get_book(req, res) {
        const id = req.params.id
        Book.findById(id)
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err.message);
            })
    }

    delete_book(req,res) {
        const id = req.params.id;
        Book.findByIdAndDelete(id)
            .then((result) => {
                res.redirect('/books');
            })
            .catch((err) => {
                console.log(err)
            })
    }
}