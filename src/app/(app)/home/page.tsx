"use client";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import api from "@/services/api";
import Image from "next/image";
import {toast} from "sonner";
// Importa o componente Image

export default function Home() {
    // useStates
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const {token} = useAuth();

    // useEffects
    useEffect(() => {
        listaLivros();
    }, [token]);

    // Funções
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

    // Renderização
    // @ts-ignore
    return (
        <div>
            <h1 className="bold text-2xl text-center">Home</h1>
            <p className="text-center">Bem-vindo a nossa livraria</p>
            <div className="grid grid-cols-3 gap-4">
                {livros.map((livro) => (
                    <div key={livro.id} className="bg-gray-500 p-4 rounded-lg">
                        <h2 className="text-xl font-bold">{livro.titulo}</h2>
                        <p>Autor: {livro.autor}</p>
                        <p className="break-words">Descrição: {livro.descricao}</p>
                        <p>Ano de publicação: {livro.ano}</p>
                        <p>Preço: {livro.preco}</p>
                        {livro.imagemUrl && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_URL_BACK}/${livro.imagemUrl}`}
                                alt={livro.titulo}
                                width={200}
                                height={300}
                                className="mt-2 object-cover rounded"
                                unoptimized={true}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
