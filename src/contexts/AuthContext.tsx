"use client";
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import api from "@/services/api";
import {toast} from "sonner";
import { jwtDecode } from "jwt-decode";

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            let currentDate = new Date();
            if (decodedToken.exp! * 1000 < currentDate.getTime()) {
                setToken(null);
                localStorage.removeItem('token');
            } else {
                setToken(token);
            }
        }
    }, []);

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
                const token = response.data.token;
                setToken(token);

                // Armazena o token em localStorage ou cookies se necessário
                localStorage.setItem('token', token);

                // Redireciona para a página principal ou outra página após o login
                router.push('/home');
        } catch (error) {
            toast.error('Credenciais inválidas');
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
