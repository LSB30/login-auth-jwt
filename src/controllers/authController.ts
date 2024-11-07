// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { User } from '../models/user';
import { AppDataSource } from '../utils/db';
import { generateToken } from '../services/authService';
import { ZodError } from 'zod';

const userRepository = AppDataSource.getRepository(User);

// Interfaces para tipar o body das requisições
interface RegisterRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso' });
      return;
    }

    const user = userRepository.create({
      email,
      password
    });

    await userRepository.save(user);
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: { token, user: { id: user.id, email: user.email } }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        error: 'Email ou senha inválidos'
      });
      return;
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: { token, user: { id: user.id, email: user.email } }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      });
      return;
    }

    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};