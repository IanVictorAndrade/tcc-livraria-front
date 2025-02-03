"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    roles: string[];
}

interface AuthContextData {
    token: string | null;
    role: string | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    const isAuthenticated = !!token;

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const decodedToken = jwtDecode<DecodedToken>(storedToken);
            const currentDate = new Date().getTime();

            if (decodedToken.exp * 1000 < currentDate) {
                setToken(null);
                setRole(null);
                localStorage.removeItem("token");
            } else {
                setToken(storedToken);
                setRole(decodedToken.roles[0]); // Pegando a role corretamente do array
            }
        }
    }, []);

    const login = async (email: string, senha: string) => {
        try {
            const response = await api.post(
                "/usuario/login",
                { email, senha },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status !== 200) {
                toast.error("Erro ao tentar logar");
                return;
            }

            const newToken = response.data.token;
            const decodedToken = jwtDecode<DecodedToken>(newToken);

            setToken(newToken);
            setRole(decodedToken.roles[0]); // Pegando a role corretamente do array

            localStorage.setItem("token", newToken);

            router.push("/home");
        } catch {
            toast.error("Credenciais inválidas");
        }
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
