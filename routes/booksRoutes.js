import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();
const bookController = new BookController();

router.get('/', requireAuth ,bookController.all_books);
router.post('/', requireAuth ,bookController.add_book);
router.get('/:id', requireAuth ,bookController.get_book);
router.delete('/:id', requireAuth ,bookController.delete_book);

export const Bookrouter = router;