"use client";
import React, { useState } from "react";

export default function EnviaToken() {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-[611px]">
                <div className="mb-6">
                    <h1 className="text-2xl text-black text-left">Recuperação de senha</h1>
                    <p className="text-sm text-[#8B8C8D]">
                        Se seu e-mail estiver cadastrado no sistema, será enviado um código de confirmação para trocar sua senha.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="E-mail"
                            required
                        />
                    </div>
                    <div className="flex gap-[12px] justify-end">
                        <a
                            href="/"
                            className="py-2 px-6 bg-[#D9D9D9] text-black rounded-md hover:bg-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            Voltar
                        </a>
                        <button
                            type="submit"
                            className="py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
