import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

export default router;