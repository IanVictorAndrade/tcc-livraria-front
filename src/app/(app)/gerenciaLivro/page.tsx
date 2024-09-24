"use client";
import React, {useEffect, useState} from 'react';
import api from "@/services/api";
import {LivroProps} from "@/@types/utils/LivroProps";
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
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editingLivroId, setEditingLivroId] = useState<number | null>(null);

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
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagem(file)
        }
    };


    const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setArquivoPDF(e.target.files[0]);
        }
    };

    const handleEdit = (livro: LivroProps) => {
        setLivro({
            titulo: livro.titulo,
            autor: livro.autor,
            descricao: livro.descricao,
            ano: livro.ano,
            preco: livro.preco,
            imagemUrl: livro.imagemUrl,
        });
        setIsEditMode(true);
        setEditingLivroId(livro.id);
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

        if (!imagem) {
            toast.error('Por favor, envie uma imagem.');
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(imagem);

        img.onload = async () => {
            if (img.width < 600 || img.height < 450) {
                toast.error('A imagem deve ter no mínimo 600x450 pixels.');
                // Limpa o input de imagem
                setImagem(null);
                const fileInput = document.getElementById("imagem") as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = ""; // Limpa o campo de input de arquivo
                }
                return;
            }

            try {
                if (isEditMode && editingLivroId) {
                    // Editar o livro
                    await api.put(`/livro/editar/${editingLivroId}`, livro, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    toast.success('Livro atualizado com sucesso!');
                } else {
                    // Cadastrar um novo livro
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
                }

                // Resetar formulário e estado de edição
                setLivro({
                    titulo: '',
                    autor: '',
                    descricao: '',
                    ano: new Date().getFullYear(),
                    preco: 0,
                    imagemUrl: null,
                });
                setImagem(null);
                setArquivoPDF(null);
                setIsEditMode(false);
                setEditingLivroId(null);
                listaLivros();
            } catch (error) {
                toast.error('Erro ao cadastrar ou editar livro:');
                console.log('Erro ao cadastrar ou editar livro', error);
            }
        };
    };


    const handleCancelEdit = () => {
        setLivro({
            titulo: '',
            autor: '',
            descricao: '',
            ano: new Date().getFullYear(),
            preco: 0,
            imagemUrl: null,
        });
        setImagem(null);
        setArquivoPDF(null);
        setIsEditMode(false);
        setEditingLivroId(null);
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
                                            className="mt-1 block text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    {!isEditMode && <>
                                        <div>
                                        <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">
                                            Imagem
                                        </label>
                                        <input
                                            type="file"
                                            id="imagem"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required={true}
                                            className="mt-1 block text-black w-full px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="arquivoPDF" className="block text-sm font-medium text-gray-700">
                                        Arquivo PDF
                                        </label>
                                        <input
                                        type="file"
                                        id="arquivoPDF"
                                        accept="application/pdf"
                                        onChange={handlePDFChange}
                                        className="mt-1 block w-full text-black px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    </>}
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
                                        {isEditMode ? 'Editar Livro' : 'Cadastrar Livro'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Linha Divisória */}
                        <div className="hidden md:block border-l border-gray-300"></div>

                        {/* Seção de Listagem de Livros */}
                        <div className="md:w-1/2">
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Livros Cadastrados</h3>
                            <ul className="space-y-4">
                                {livros.map((livro) => (
                                    <li
                                        key={livro.id}
                                        className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{livro.titulo}</p>
                                            <p className="text-xs text-gray-500">Autor: {livro.autor}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(livro)}
                                                className="text-yellow-500 hover:text-yellow-700 font-semibold focus:outline-none focus:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(livro.id)}
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
