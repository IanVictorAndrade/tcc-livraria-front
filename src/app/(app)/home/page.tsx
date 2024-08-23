"use client";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import api from "@/services/api";
import Image from "next/image";
import {toast} from "sonner";

export default function Home() {
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const {token} = useAuth();

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

    return (
        <div>
            <h1 className="bold text-2xl text-center">Home</h1>
            <p className="text-center">Bem-vindo a nossa livraria</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {livros.map((livro) => (
                    <div key={livro.id} className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
                        {livro.imagemUrl && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_URL_BACK}/${livro.imagemUrl}`}
                                alt={livro.titulo}
                                width={200}
                                height={300}
                                className="rounded object-cover"
                                unoptimized={true}
                                priority={true}
                            />
                        )}
                        <div className="mt-4 text-center">
                            <h2 className="text-lg text-black font-semibold">{livro.titulo}</h2>
                            <p className="text-gray-600">Autor: {livro.autor}</p>
                            <p className="text-gray-600">Ano: {livro.ano}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
