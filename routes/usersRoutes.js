import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

const router = Router()
const userController = new UserController()

router.post('/signup', userController.post_signup);
router.post('/login', userController.post_login);
router.post('/logout', userController.logout);

export const UserRouter = router;