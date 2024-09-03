"use client";
import React, {useEffect, useState} from 'react';
import api from "@/services/api";
import {toast} from "sonner";
import {useAuth} from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import {UsuarioProps, UsuarioPropsCadastro} from "./UsuarioProps";


export default function GerenciaUsuario() {
    const { token } = useAuth();
    const [usuarios, setUsuarios] = useState<Array<UsuarioProps>>([]);
    const [usuario, setUsuario] = useState<Omit<UsuarioProps, 'id'>>({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        role: [{ id: 1, nome: "Administrador" }],
    });
    const [usuarioCadastro, setUsuarioCadastro] = useState<Omit<UsuarioPropsCadastro, 'id'>>({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        role: '',
    });
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    useEffect(() => {
        listaUsuarios();
    }, [token]);

    const listaUsuarios = async () => {
        try {
            const response = await api.get('/usuario/listar', {
                headers: {Authorization: `${token}`}
            });
            const sortedUsuarios = response.data.sort((a: UsuarioProps, b: UsuarioProps) => a.nome.localeCompare(b.nome));
            setUsuarios(sortedUsuarios);
        } catch {
            window.location.href = '/';
            toast.error('Necessário fazer o login para acessar a página');
        }
    }

    const resetarSenhaUsuario = async (email: string) => {
        try {
            await api.post('/usuario/codigo-senha', {email}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Código para trocar de senha foi enviado no e-mail com sucesso!');
        } catch (error) {
            toast.error('Erro ao resetar a senha do Usuário:');
            console.log('Erro ao resetar a senha do Usuário', error);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setUsuario({
            ...usuario,
            [name]: value,
        });
        setUsuarioCadastro({
            ...usuarioCadastro,
            [name]: value,
        });
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;

        const selectedRole: [{ id: number; nome: string }] = value === "ROLE_ADMIN"
            ? [{ id: 1, nome: "ROLE_ADMIN" }]
            : [{ id: 2, nome: "ROLE_USER" }];

        setUsuario({
            ...usuario,
            role: selectedRole,
        });
        setUsuarioCadastro({
           ...usuarioCadastro,
           role: value
        });
    };

    const handleEdit = (user: UsuarioProps) => {
        setUsuario({
            nome: user.nome,
            cpf: user.cpf,
            email: user.email,
            senha: user.senha,
            role: user.role[0].nome === "ROLE_ADMIN" ? [{ id: 1, nome: "ROLE_ADMIN" }] : [{ id: 2, nome: "ROLE_USER" }],
        });
        setIsEditMode(true);
        setEditingUserId(user.id);
    };

    const handleDelete = async (userId: number) => {
        try {
            await api.delete(`/usuario/deletar/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsuarios(usuarios.filter(usuario => usuario.id !== userId));
            toast.success('Usuário excluído com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir Usuário:');
            console.log('Erro ao excluir Usuário', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && editingUserId) {
                // Editar o Usuário
                await api.put(`/usuario/editar/${editingUserId}`, usuario, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Usuário atualizado com sucesso!');
            } else {
                // Cadastrar um novo Usuário
                await api.post('/usuario/cadastrar', usuarioCadastro, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                toast.success('Usuário cadastrado com sucesso!');
            }

            // Resetar formulário e estado de edição
            setUsuario({
                nome: '',
                email: '',
                cpf: '',
                senha: '',
                role: [{ id: 1, nome: "Administrador" }],
            });
            setIsEditMode(false);
            setEditingUserId(null);
            listaUsuarios();
        } catch (error) {
            toast.error('Erro ao cadastrar ou editar Usuário:');
            console.log('Erro ao cadastrar ou editar Usuário', error);
        }
    };

    const handleCancelEdit = () => {
        setUsuario({
            nome: '',
            email: '',
            cpf: '',
            senha: '',
            role: [{ id: 1, nome: "Administrador" }],
        });
        setIsEditMode(false);
        setEditingUserId(null);
    };


    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center pt-12">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gerenciar Usuários</h2>
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        {/* Seção de Cadastro de Usuário */}
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Cadastro de Usuário</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                                            Nome
                                        </label>
                                        <input
                                            type="text"
                                            id="nome"
                                            name="nome"
                                            value={usuario.nome}
                                            onChange={handleInputChange}
                                            required={true}
                                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            E-mail
                                        </label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={usuario.email}
                                            onChange={handleInputChange}
                                            required={true}
                                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                                            CPF
                                        </label>
                                        <input
                                            id="cpf"
                                            name="cpf"
                                            value={usuario.cpf}
                                            onChange={handleInputChange}
                                            required={true}
                                            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    {isEditMode ?
                                        <>
                                            <label htmlFor="senha"
                                                   className="block text-sm font-medium text-gray-700">Senha</label>
                                            <button
                                                type={"button"}
                                                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    resetarSenhaUsuario(usuario.email)
                                                }}>
                                                Resetar a senha desse usuário
                                            </button>
                                        </>
                                        :
                                        <div>
                                            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                                                Senha
                                            </label>
                                            <input
                                                id="senha"
                                                name="senha"
                                                value={usuario.senha}
                                                onChange={handleInputChange}
                                                required={true}
                                                className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>}
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Permissão
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={usuario.role[0].nome}
                                            onChange={handleRoleChange}
                                            required={true}
                                            className="mt-1 block w-full text-black bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="ROLE_ADMIN">Administrador</option>
                                            <option value="ROLE_USER">Usuário</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    {isEditMode && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                                        >
                                            Cancelar Edição
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className={`${
                                            isEditMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-amber-500 hover:bg-amber-600'
                                        } text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75`}
                                    >
                                        {isEditMode ? 'Editar Usuário' : 'Cadastrar Usuário'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Linha Divisória */}
                        <div className="hidden md:block border-l border-gray-300"></div>

                        {/* Seção de Listagem de Usuários */}
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Usuários Cadastrados</h3>
                            <ul className="space-y-4">
                                {usuarios.map((usuario) => (
                                    <li
                                        key={usuario.id}
                                        className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{usuario.nome}</p>
                                            <p className="text-xs text-gray-500">E-mail: {usuario.email}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(usuario)}
                                                className="text-yellow-500 hover:text-yellow-700 font-semibold focus:outline-none focus:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(usuario.id)}
                                                className="text-red-500 hover:text-red-700 font-semibold focus:outline-none focus:underline"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
