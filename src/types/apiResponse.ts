export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    details?: any;
  }
  
  // Tipo para os dados do usuário
  export interface UserData {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Tipo para a resposta de autenticação
  export interface AuthResponse {
    token: string;
    user: Omit<UserData, 'password'>;
  }