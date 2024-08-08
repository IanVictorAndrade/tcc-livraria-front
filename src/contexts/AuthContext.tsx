"use client";
import { createContext, ReactNode, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from "@/services/api";
import {toast} from "sonner";

interface AuthContextData {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    const isAuthenticated = !!token;

    const login = async (email: string, senha: string) => {
        try {
            const response = await api.post('/usuario/login', {
                email,
                senha,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status !== 200) {
                toast.error("Erro ao tentar logar")
            }
                toast.success("Bem Vindo")
                const token = response.data.token;
                console.log('Token recebido:', token);
                setToken(token);

                // Armazena o token em localStorage ou cookies se necessário
                localStorage.setItem('token', token);

                // Redireciona para a página principal ou outra página após o login
                router.push('/detalhaLivro');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
