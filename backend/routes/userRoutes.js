import express from 'express';
import { loginController, registerController, authController } from '../controllers/userctrl.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

//login
router.post('/login', loginController);

//register
router.post('/register', registerController);

//auth
router.post('/getUserData', authenticate, authController)


export default router;