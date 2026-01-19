import { http } from "./http";

export interface User {
  _id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string) => {
  // http interceptor unwraps response.data.data
  // So 'data' here is { token, _id, email... }
  const data = await http.post<any>("/api/auth/login", { email, password });
  
  const { token, ...userData } = data;
  return { token, user: userData as User };
};

export const getMe = async () => {
    // http interceptor unwraps response.data.data -> { _id, email }
    const userData = await http.get<any>("/api/auth/me");
    return { user: userData as User };
}
