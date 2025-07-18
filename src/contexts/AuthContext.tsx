import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { IAddress } from "@/lib/types";

interface User {
  id: string;
  role: "admin" | "user";
  email: string;
  name?: string;
  phone?: string;
  AddressData?:IAddress;
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

  const fetchUserAndAddress = async (token: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_URI}users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const user = res.data.user;

        const addressRes = await axios.get(
          `${process.env.NEXT_PUBLIC_URI}/addresses/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (addressRes.status === 200 && addressRes.data.data.length > 0) {
          user.AddressData = addressRes.data.data[0];
        }

        setState({
          user,
          isAuthenticated: true,
          token,
          loading: false,
        });

        toast({
          title: "Welcome back!",
          description: `Hello ${user.name || user.email}`,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user or address", error);
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
      fetchUserAndAddress(token);
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URI}/auth/login`, {
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
        `${process.env.NEXT_PUBLIC_URI}/auth/register`,
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
