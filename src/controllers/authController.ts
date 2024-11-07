// src/controllers/AuthController.ts
import { Request, Response } from "express";
import { User } from "../models/user";
import { AppDataSource } from "../utils/db";
import { generateToken } from "../services/authService.ts";
import { ZodError } from "zod";

const userRepository = AppDataSource.getRepository(User);

// Interface para erros customizados
interface CustomError {
  message: string;
  code?: string;
}

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email já está em uso" });
      }

      const user = userRepository.create({
        email,
        password,
      });

      await userRepository.save(user);
      const token = generateToken(user.id);

      return res.status(201).json({
        message: "Usuário criado com sucesso",
        token,
      });
    } catch (error) {
      // Tratamento de erros tipado
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: error.errors,
        });
      }

      if (error instanceof Error) {
        console.error("Erro ao registrar usuário:", error.message);
        return res.status(500).json({ error: error.message });
      }

      // Fallback para outros tipos de erro
      console.error("Erro desconhecido:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async login  (req: Request, res: Response)  {
    try {
      const { email, password } = req.body;
  
      const user = await userRepository.findOne({ where: { email } });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }
  
      const token = generateToken(user.id);
  
      return res.status(200).json({
        message: "Login realizado com sucesso",
        token,
      });
    } catch (error) {
      // Tratamento de erros tipado
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          details: error.errors,
        });
      }
  
      if (error instanceof Error) {
        console.error("Erro ao fazer login:", error.message);
        return res.status(500).json({ error: error.message });
      }
  
      console.error("Erro desconhecido:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
  
}

