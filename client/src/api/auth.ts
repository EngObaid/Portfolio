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
  // We cast to unknown first because TS thinks it returns AxiosResponse
  const data = await http.post<any>("/api/auth/login", { email, password }) as unknown as LoginApiResponse;
  
  const { token, ...userData } = data;
  return { token, user: userData as User };
};

export const getMe = async (): Promise<{ user: User }> => {
    // http interceptor unwraps response.data.data -> { _id, email }
    const userData = await http.get<any>("/api/auth/me") as unknown as User;
    return { user: userData };
}
