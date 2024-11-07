import { Router } from 'express';
import { register, login } from '../controllers/AuthController';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;