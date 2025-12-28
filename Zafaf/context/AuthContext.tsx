import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSegments } from "expo-router";
import { User, AuthResponse } from "../types/User";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "../api/auth";
import { getToken, setToken, removeToken } from "../api/storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check if user is authenticated on app launch
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getToken();
        if (token) {
          const response = await getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error("Error restoring token:", error);
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(protected)/(tabs)/home");
    }
  }, [user, segments, isLoading]);

  const authContext: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: async (email: string, password: string) => {
      try {
        const response = await apiLogin(email, password);
        await setToken(response.token);
        setUser(response.user);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    register: async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      confirmPassword: string
    ) => {
      try {
        const response = await apiRegister(
          firstName,
          lastName,
          email,
          password,
          confirmPassword
        );
        await setToken(response.token);
        setUser(response.user);
      } catch (error) {
        console.error("Register error:", error);
        throw error;
      }
    },
    logout: async () => {
      try {
        await apiLogout();
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        await removeToken();
        setUser(null);
        router.replace("/(auth)/login");
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
