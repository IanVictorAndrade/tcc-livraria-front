"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";

interface CustomJwtPayload {
    nome: string;
    cpf: string;
    sub: string;
    id: number;
}

export default function Perfil() {
    const token = localStorage.getItem("token");
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    // Estados para os valores originais
    const [originalNome, setOriginalNome] = useState("");
    const [originalCpf, setOriginalCpf] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1])) as CustomJwtPayload;
                setNome(decodedToken.nome || "");
                setCpf(decodedToken.cpf || "");
                setEmail(decodedToken.sub || "");
                setId(decodedToken.id || 0);

                // Armazenar valores originais
                setOriginalNome(decodedToken.nome || "");
                setOriginalCpf(decodedToken.cpf || "");
                setOriginalEmail(decodedToken.sub || "");
            } catch (error) {
                console.error("Erro ao decodificar o token", error);
            }
        }
    }, [token]);

    const ResetarSenha = async (email: string) => {
        try {
            const response = await api.post("/usuario/codigo-senha", { email });
            if (response.status === 200) {
                toast.success("Código para trocar a senha foi enviado no e-mail!");
            }
        } catch {
            toast.error("Erro ao enviar código no e-mail");
        }
    };

    const AtualizarPerfil = async () => {
        try {
            const response = await api.put(`/usuario/editar/${id}`, {
                nome,
                cpf,
                email,
            });
            if (response.status === 200) {
                toast.success("Perfil atualizado com sucesso!");
                setIsEditing(false);
                // Atualiza os valores originais
                setOriginalNome(nome);
                setOriginalCpf(cpf);
                setOriginalEmail(email);
            }
        } catch {
            toast.error("Erro ao atualizar perfil");
        }
    };

    // Verifica se houve alterações
    const hasChanges = () => {
        return nome !== originalNome || cpf !== originalCpf || email !== originalEmail;
    };

    const cancelarEdicao = () => {
        setNome(originalNome);
        setCpf(originalCpf);
        setEmail(originalEmail);
        setIsEditing(false);
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col mt-8 justify-center items-center p-6">
                <div className="w-[70rem]">
                    <h1 className="text-left text-2xl py-3 mb-8 border-b border-[#D9D9D9] w-[14rem]">Perfil do Usuário</h1>
                    <div className="flex gap-8 mb-4">
                        <div className="flex flex-col">
                            <label htmlFor="Username">Nome</label>
                            <input
                                type="text"
                                id="Username"
                                className="outline-none min-w-[30rem] px-2 py-1 rounded-sm"
                                value={nome}
                                readOnly={!isEditing}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="CPF">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                className="outline-none min-w-[30rem] px-2 py-1 rounded-sm"
                                value={cpf}
                                readOnly={!isEditing}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-8 mb-4">
                        <div className="flex flex-col">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                id="email"
                                className="outline-none min-w-[30rem] px-2 py-1 rounded-sm"
                                value={email}
                                readOnly={!isEditing}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="senha">Senha</label>
                            <button
                                onClick={() => ResetarSenha(email)}
                                id="senha"
                                className={`bg-[#792b15] hover:bg-orange-700 text-white font-semibold py-1 px-4 rounded-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 min-w-[30rem]`}
                            >
                                Resetar Senha
                            </button>
                        </div>
                    </div>
                    {/* Botões de ativação e cancelamento de edição */}
                    <div className="mt-4 flex gap-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-sm"
                            >
                                Alterar Informações
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={AtualizarPerfil}
                                    className={`bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-sm ${hasChanges() ? "" : "opacity-50 cursor-not-allowed"}`}
                                    disabled={!hasChanges()}
                                >
                                    Confirmar Alterações
                                </button>
                                <button
                                    onClick={cancelarEdicao}
                                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-sm"
                                >
                                    Cancelar Edição
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
