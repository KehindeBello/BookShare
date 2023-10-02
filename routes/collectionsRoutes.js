import { Router } from "express";
import { CollectionController } from "../controllers/collection.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();
const collectionConroller = new CollectionController()

router.post('/create', requireAuth, collectionConroller.create_collection)
router.get('/', requireAuth, collectionConroller.get_collection);

export const Collectionrouter = router;