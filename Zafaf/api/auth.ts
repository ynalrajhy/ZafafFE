import api from "./index";
import { User, AuthResponse } from "../types/User";

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<{ user: User }> => {
  const response = await api.get("/auth/me");
  return response.data;
};
