import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  role: "admin" | "user";
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
  loading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("token") || undefined,
    loading: true,
  });

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setState((prev) => ({
          ...prev,
          user: res.data.user,
          isAuthenticated: true,
          token,
          loading: false,
        }));

        toast({
          title: "Welcome back!",
          description: `Hello ${res.data.user.name || res.data.user.email}`,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      localStorage.removeItem("token");

      setState({
        user: null,
        isAuthenticated: false,
        token: undefined,
        loading: false,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password,
      });

      if (res.status === 200) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);

        setState({
          user,
          isAuthenticated: true,
          token,
          loading: false,
        });

        toast({
          title: "Login Successful",
          description: `Welcome, ${user.name || user.email}`,
        });

        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed", err);
      toast({
        title: "Login Failed",
        description:
          err?.response?.data?.message || "Invalid email or password",
      });
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          name,
          email,
          password,
          role: "user",
        }
      );

      if (res.status === 201) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);

        setState({
          user,
          isAuthenticated: true,
          token,
          loading: false,
        });

        toast({
          title: "Signup Successful",
          description: `Welcome, ${user.name || user.email}`,
        });

        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup failed", err);
      toast({
        title: "Signup Failed",
        description:
          err?.response?.data?.message || "Something went wrong. Try again.",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setState({
      user: null,
      isAuthenticated: false,
      token: undefined,
      loading: false,
    });

    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
