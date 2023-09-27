import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

const router = Router()
const userController = new UserController()

router.get('/signup', userController.get_signup);
router.post('/signup', userController.post_signup);
router.get('/login', userController.get_login);
router.post('/login', userController.post_login);

export const UserRouter = router;