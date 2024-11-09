import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ZodError } from "zod";
import { ApiResponse, AuthResponse } from "../types/apiResponse";

// Interface para erros customizados
interface CustomError extends Error {
  message: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(
    req: Request<{}, {}, RegisterRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.register(email, password);
      
      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        data: result,
      } as ApiResponse<AuthResponse>);
    } catch (error: unknown) {
      // Tratamento tipado dos erros
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
        return;
      }

      // Type guard para verificar se é um erro customizado
      if (this.isCustomError(error) && error.message === "EMAIL_IN_USE") {
        res.status(400).json({
          success: false,
          error: "Email já está em uso"
        });
        return;
      }

      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  async login(
    req: Request<{}, {}, LoginRequest>,
    res: Response
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors,
        });
        return;
      }

      if (this.isCustomError(error) && error.message === "INVALID_CREDENTIALS") {
        res.status(401).json({
          success: false,
          error: "Email ou senha inválidos",
        });
        return;
      }

      console.error("Erro ao fazer login:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  }

  // Type guard para verificar se o erro é do tipo CustomError
  private isCustomError(error: unknown): error is CustomError {
    return (
      error instanceof Error &&
      'message' in error
    );
  }
}