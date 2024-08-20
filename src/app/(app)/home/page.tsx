"use client";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import api from "@/services/api";

export default function Home() {

    // useStates
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const { token } = useAuth();

    // useEffects
    useEffect(() => {
        listaLivros();
    }, [token]);


    // Funções
    const listaLivros = async () => {
        const response = await api.get('/livro/listar', {
            headers: {Authorization: `${token}`}
        });
        const sortedLivros = response.data.sort((a: LivroProps, b: LivroProps) => a.titulo.localeCompare(b.titulo));
        setLivros(sortedLivros);
    }


    // Renderização
    return (
        <div>
            <h1 className="bold text-2xl text-center">Home</h1>
            <p className="text-center">Bem-vindo a nossa livraria</p>
            <div className="grid grid-cols-3 gap-4">
                {livros.map((livro) => (
                    <div key={livro.id} className="bg-gray-500 p-4 rounded-lg">
                        <h2 className="text-xl font-bold">{livro.titulo}</h2>
                        <p>autor: {livro.autor}</p>
                        <p className="break-words">descrição: {livro.descricao}</p>
                        <p>ano de publicação: {livro.ano}</p>
                        <p>preço: {livro.preco}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}