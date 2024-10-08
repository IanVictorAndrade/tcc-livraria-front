"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function Perfil() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [isEditingNome, setIsEditingNome] = useState(false);
    const [isEditingCpf, setIsEditingCpf] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    return (
        <>
            <Navbar />
            <div className="flex flex-col mt-8 justify-center items-center p-6">
                <div className="w-[70rem]">
                    <h1 className="text-left text-2xl py-3 mb-8 border-b border-[#D9D9D9] w-[14rem]">Perfil do Usuário</h1>
                    <div className="flex gap-8 mb-4">
                        <div className="flex flex-col relative">
                            <label htmlFor="Username">Nome</label>
                            <input
                                type="text"
                                id="Username"
                                className="min-w-[30rem] px-2 py-1 rounded-sm pr-10"
                                value={nome}
                                readOnly={!isEditingNome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <button
                                onClick={() => setIsEditingNome(!isEditingNome)}
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 mt-[0.7rem]`}
                            >
                                <FaEdit className={isEditingNome ? "text-green-500" : "text-black hover:text-gray-500"} />
                            </button>
                        </div>
                        <div className="flex flex-col relative">
                            <label htmlFor="CPF">CPF</label>
                            <input
                                type="text"
                                id="cpf"
                                className="min-w-[30rem] px-2 py-1 rounded-sm pr-10"
                                value={cpf}
                                readOnly={!isEditingCpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                            <button
                                onClick={() => setIsEditingCpf(!isEditingCpf)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 mt-[0.7rem]"
                            >
                                <FaEdit className={isEditingCpf ? "text-green-500" : "text-black hover:text-gray-500"} />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="flex flex-col relative">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                id="email"
                                className="min-w-[30rem] px-2 py-1 rounded-sm pr-10"
                                value={email}
                                readOnly={!isEditingEmail}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                onClick={() => setIsEditingEmail(!isEditingEmail)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 mt-[0.7rem]"
                            >
                                <FaEdit className={isEditingEmail ? "text-green-500" : "text-black hover:text-gray-500"} />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="senha">Senha</label>
                            <button
                                onClick={() => {
                                    alert(`Senha resetada com sucesso!, ${email}`);
                                }}
                                id="senha"
                                className={`bg-[#792b15] hover:bg-orange-700 text-white font-semibold py-1 px-4 rounded-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 min-w-[30rem]`}
                            >
                                Resetar Senha
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
