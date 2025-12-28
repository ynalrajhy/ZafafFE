import api from "./index";
import { User } from "../types/User";

export const getUserProfile = async (id: string): Promise<{ user: User }> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (
  id: string,
  userData: Partial<User>
) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const getAllUsers = async (filters?: any) => {
  const response = await api.get("/users", { params: filters });
  return response.data;
};
