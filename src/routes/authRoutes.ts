import { Router, Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware';

const router = Router();

// Tipando explicitamente as rotas
router.post(
  '/register',
  validateRegister,
  async (req: Request, res: Response) => {
    await register(req, res);
  }
);

router.post(
  '/login',
  validateLogin,
  async (req: Request, res: Response) => {
    await login(req, res);
  }
);

export default router;