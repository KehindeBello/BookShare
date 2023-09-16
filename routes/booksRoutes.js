import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';

const router = Router();
const bookController = new BookController();

router.get('/', bookController.all_books);
router.post('/', bookController.add_book);
router.get('/:id', bookController.get_book);
router.delete('/:id',bookController.delete_book);

export const Bookrouter = router;