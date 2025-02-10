"use client";
import React, { useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";

export default function CadastroPage() {
    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        cpf: "",
        senha: "",
        role: "ROLE_USER",
    });

    const [emailValido, setEmailValido] = useState(true);
    const [cpfValido, setCpfValido] = useState(true);

    // Valida se o e-mail termina com "@gmail.com"
    const validarEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        setEmailValido(regex.test(email));
        setUsuario({ ...usuario, email });
    };

    // Formata o CPF para o padrão 000.000.000-00 e impede mais de 11 números
    const formatarCPF = (cpf: string) => {
        let cpfLimpo = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

        if (cpfLimpo.length > 11) {
            cpfLimpo = cpfLimpo.slice(0, 11); // Garante que tenha no máximo 11 dígitos
        }

        setCpfValido(cpfLimpo.length === 11); // Define se o CPF é válido

        const cpfFormatado = cpfLimpo
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setUsuario({ ...usuario, cpf: cpfFormatado });
    };

    // Remove a máscara do CPF antes de enviar ao backend
    const removerMascaraCPF = (cpf: string) => cpf.replace(/\D/g, "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "email") {
            validarEmail(value);
        } else if (name === "cpf") {
            formatarCPF(value);
        } else {
            setUsuario({ ...usuario, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailValido) {
            toast.error("O e-mail precisa ser do domínio @gmail.com");
            return;
        }

        if (!cpfValido) {
            toast.error("CPF inválido! Digite os 11 números corretamente.");
            return;
        }

        try {
            const usuarioFormatado = {
                ...usuario,
                cpf: removerMascaraCPF(usuario.cpf), // Remove a máscara antes de enviar
            };

            await api.post("/usuario/cadastrar", usuarioFormatado);
            toast.success("Usuário cadastrado com sucesso!");
            window.location.href = "/";
        } catch (error: any) {
            // Verifica se o erro possui uma resposta do servidor e um status 400
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || "Erro ao cadastrar usuário");
            } else {
                toast.error("Erro ao cadastrar usuário");
            }
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl text-black text-center mb-6">Cadastro</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={usuario.nome}
                            onChange={handleChange}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite seu nome"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail:</label>
                        <input
                            type="email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite seu e-mail"
                            required
                        />
                        {!emailValido && (
                            <p className="text-red-600 text-xs mt-1">
                                O e-mail deve ser do domínio <b>@gmail.com</b>
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CPF:</label>
                        <input
                            type="text"
                            name="cpf"
                            value={usuario.cpf}
                            onChange={handleChange}
                            maxLength={14} // Garante que o CPF tenha no máximo 14 caracteres com a máscara
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite seu CPF"
                            required
                        />
                        {!cpfValido && (
                            <p className="text-red-600 text-xs mt-1">
                                O CPF deve conter <b>11 números</b>.
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha:</label>
                        <input
                            type="password"
                            name="senha"
                            value={usuario.senha}
                            onChange={handleChange}
                            className="mt-1 block w-full px-0 py-2 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black sm:text-sm"
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>

                    {/* Linha para "Login" e "Cadastrar" */}
                    <div className="flex justify-between text-sm">
                        <a href="/" className="text-indigo-600 hover:underline">
                            Login
                        </a>
                    </div>

                    <div className="flex items-start">
                        <button
                            type="submit"
                            disabled={!emailValido || !cpfValido}
                            className={`w-full py-2 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                                emailValido && cpfValido
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                            }`}
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
