import { Router } from "express";
import { CollectionController } from "../controllers/collection.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();
const collectionConroller = new CollectionController()

router.post('/', requireAuth, collectionConroller.create_collection)
router.get('/', requireAuth, collectionConroller.get_collection);
router.post('/:id', requireAuth, collectionConroller.add_book_to_collection);

export const Collectionrouter = router;