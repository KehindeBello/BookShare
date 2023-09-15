import { Book } from "../models/Books.js"

export class BookController {

    all_books(req, res) {
        Book.find().sort({createdAt: "desc"})
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
}