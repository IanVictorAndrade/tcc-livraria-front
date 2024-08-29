"use client";
import React, {useEffect, useState} from 'react';
import api from "@/services/api";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {toast} from "sonner";
import {useAuth} from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";


export default function GerenciaLivro() {
    const {token} = useAuth();
    const [livro, setLivro] = useState<Omit<LivroProps, 'id'>>({
        titulo: '',
        autor: '',
        descricao: '',
        ano: new Date().getFullYear(),
        preco: 0,
        imagemUrl: null,
    });
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const [imagem, setImagem] = useState<File | null>(null);
    const [arquivoPDF, setArquivoPDF] = useState<File | null>(null);


    useEffect(() => {
        listaLivros();
    }, [token]);

    const listaLivros = async () => {
        try {
            const response = await api.get('/livro/listar', {
                headers: {Authorization: `${token}`}
            });
            const sortedLivros = response.data.sort((a: LivroProps, b: LivroProps) => a.titulo.localeCompare(b.titulo));
            setLivros(sortedLivros);
        } catch {
            window.location.href = '/';
            toast.error('Necessário fazer o login para acessar a página');
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setLivro({
            ...livro,
            [name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImagem(e.target.files[0]);
        }
    };

    const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setArquivoPDF(e.target.files[0]);
        }
    };

    const handleDelete = async (livroId: number) => {
        try {
            await api.delete(`/livro/deletar/${livroId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLivros(livros.filter(livro => livro.id !== livroId));
            toast.success('Livro excluído com sucesso!');
        } catch (error) {
            toast.error('Erro ao excluir livro:');
            console.log('Erro ao excluir livro', error);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Cadastrar o livro
            const response = await api.post('/livro/cadastrar', livro, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const livroId = response.data.id;

            // Fazer upload da imagem
            if (imagem && livroId) {
                const formDataImagem = new FormData();
                formDataImagem.append('imagem', imagem);
                await api.post(`/livro/enviarImagem/${livroId}`, formDataImagem, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Fazer upload do arquivo PDF
            if (arquivoPDF && livroId) {
                const formDataPDF = new FormData();
                formDataPDF.append('file', arquivoPDF);
                await api.post(`/google-drive/upload/${livroId}`, formDataPDF, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            toast.success('Livro cadastrado com sucesso!');
        } catch (error) {
            toast.error('Erro ao cadastrar livro:');
            console.log('Erro ao cadastrar livro', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center pt-12">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gerenciar Livros</h2>
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
                        {/* Seção de Cadastro de Livro */}
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Cadastro de Livro</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            id="titulo"
                                            name="titulo"
                                            value={livro.titulo}
                                            onChange={handleChange}
                                            required={true}
                                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="autor" className="block text-sm font-medium text-gray-700">
                                            Autor
                                        </label>
                                        <input
                                            type="text"
                                            id="autor"
                                            name="autor"
                                            value={livro.autor}
                                            onChange={handleChange}
                                            required={true}
                                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                                            Descrição
                                        </label>
                                        <textarea
                                            id="descricao"
                                            name="descricao"
                                            value={livro.descricao}
                                            onChange={handleChange}
                                            required={true}
                                            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="ano" className="block text-sm font-medium text-gray-700">
                                            Ano
                                        </label>
                                        <input
                                            type="number"
                                            id="ano"
                                            name="ano"
                                            value={livro.ano}
                                            onChange={handleChange}
                                            required
                                            onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                const currentYear = new Date().getFullYear();
                                                if (input.value.length > 4) {
                                                    input.value = input.value.slice(0, 4);
                                                }
                                                if (parseInt(input.value, 10) > currentYear) {
                                                    input.value = currentYear.toString();
                                                }
                                            }}
                                            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            maxLength={4}
                                            min="1000"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                                            Preço
                                        </label>
                                        <input
                                            type="number"
                                            id="preco"
                                            name="preco"
                                            value={livro.preco}
                                            onChange={handleChange}
                                            required={true}
                                            className="mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                            Imagem do Livro
                                        </label>
                                        <input
                                            type="file"
                                            id="imagem"
                                            name="imagem"
                                            onChange={handleImageChange}
                                            required={true}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="arquivoPDF" className="block text-sm font-medium text-gray-700">
                                            Arquivo PDF
                                        </label>
                                        <input
                                            type="file"
                                            id="arquivoPDF"
                                            name="arquivoPDF"
                                            onChange={handlePDFChange}
                                            required={true}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
                                    >
                                        Cadastrar Livro
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Linha Divisória */}
                        <div className="hidden md:block border-l border-gray-300"></div>

                        {/* Seção de Livros Cadastrados */}
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Livros Cadastrados</h3>
                            <ul className="space-y-4">
                                {livros.map((livro) => (
                                    <li key={livro.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{livro.titulo}</h4>
                                            <p className="text-gray-600">{livro.autor}</p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => alert('Função de editar em desenvolvimento!')}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(livro.id)}
                                                className="text-red-600 hover:text-red-900"
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
