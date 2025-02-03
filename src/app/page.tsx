"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl text-black text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite aqui seu e-mail"
                            required
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <label className="block text-sm font-medium text-gray-700">Senha:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite aqui sua senha"
                            required
                        />
                        <a
                            href="/enviaToken"
                            className="text-indigo-600 hover:underline text-sm flex items-center justify-center mt-1"
                        >
                            Esqueci minha senha
                        </a>
                    </div>
                    <div className="flex items-start">

                        <button
                            type="submit"
                            className="max-w-md py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
