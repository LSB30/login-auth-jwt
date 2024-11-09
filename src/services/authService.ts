import { User } from "../models/user";
import { AppDataSource } from "../utils/db";
import { comparePasswords, generateToken, hashPassword } from "../utils/auth";
import { AuthResponse, UserData } from "../types/apiResponse";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new Error("EMAIL_IN_USE");
    }

    const hashedPassword = await hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    // Convertendo o ID para string antes de passar para o generateToken
    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await comparePasswords(password, user.password))) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}