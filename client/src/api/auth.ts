import { http } from "./http";

export interface User {
  _id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// DTO mirroring what server actually returns in the 'data' field
interface LoginApiResponse {
  token: string;
  _id: string;
  email: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // http interceptor unwraps response.data.data
  const response = await http.post("/api/auth/login", { email, password });
  const data = response as unknown as LoginApiResponse;
  
  const { token, ...userData } = data;
  return { token, user: userData as User };
};

export const getMe = async (): Promise<{ user: User }> => {
    // http interceptor unwraps response.data.data -> { _id, email }
    const response = await http.get("/api/auth/me");
    const userData = response as unknown as User;
    return { user: userData };
}
