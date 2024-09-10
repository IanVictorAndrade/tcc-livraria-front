"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import { useSearchParams } from "next/navigation";
import voltarParaPaginaComDelay from "@/@types/utils/voltarPaginaDelay";

export default function TrocaSenha() {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [tokenRecuperacao, setTokenRecuperacao] = useState('');
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setTokenRecuperacao(token);
        }
    }, [searchParams]);



    async function handleSubmit(e: any) {
        e.preventDefault();
        if (novaSenha !== confirmaSenha) {
            toast.error('As senhas não conferem');
            return;
        }

        try {
            await api.put('usuario/alterar-senha', { novaSenha, token: tokenRecuperacao });
            toast.success('Senha alterada com sucesso!');
            voltarParaPaginaComDelay('/');
        } catch (error) {
            toast.error('Erro ao alterar a senha');
        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-[611px]">
                    <div className="mb-6">
                        <h1 className="text-2xl text-black text-left">Alterar a senha</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                                placeholder="Nova senha"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                                placeholder="Confirmar senha"
                                required
                            />
                        </div>
                        <div className="flex gap-[12px] justify-end">
                            <a
                                href="/enviaToken"
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
        </>
    );
}
