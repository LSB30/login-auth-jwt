import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    RegisterSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Erro de validação',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    LoginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Erro de validação',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};