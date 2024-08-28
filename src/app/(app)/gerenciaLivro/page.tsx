"use client";
import React, {useState} from 'react';
import api from "@/services/api";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {toast} from "sonner";
import {useAuth} from "@/contexts/AuthContext";
import Link from "next/link";
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

    const [imagem, setImagem] = useState<File | null>(null);
    const [arquivoPDF, setArquivoPDF] = useState<File | null>(null);

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
            <Navbar/>
            <div className="flex justify-center items-center min-h-screen p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Cadastro de Livro</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                                Título
                            </label>
                            <input
                                type="text"
                                name="titulo"
                                id="titulo"
                                value={livro.titulo}
                                onChange={handleChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="autor" className="block text-sm font-medium text-gray-700">
                                Autor
                            </label>
                            <input
                                type="text"
                                name="autor"
                                id="autor"
                                value={livro.autor}
                                onChange={handleChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                                Descrição
                            </label>
                            <textarea
                                name="descricao"
                                id="descricao"
                                value={livro.descricao}
                                onChange={handleChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ano" className="block text-sm font-medium text-gray-700">
                                Ano de Publicação
                            </label>
                            <input
                                type="number"
                                name="ano"
                                id="ano"
                                value={livro.ano}
                                onChange={handleChange}
                                maxLength={4}
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value.length > 4) {
                                        input.value = input.value.slice(0, 4);
                                    }
                                }}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                                Preço
                            </label>
                            <input
                                type="number"
                                name="preco"
                                id="preco"
                                value={livro.preco}
                                onChange={handleChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                Imagem do Livro
                            </label>
                            <input
                                type="file"
                                name="imagem"
                                id="imagem"
                                onChange={handleImageChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="arquivoPDF" className="block text-sm font-medium text-gray-700">
                                Arquivo PDF do Livro
                            </label>
                            <input
                                type="file"
                                name="arquivoPDF"
                                id="arquivoPDF"
                                onChange={handlePDFChange}
                                className="mt-2 block w-full bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                required
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cadastrar Livro
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
