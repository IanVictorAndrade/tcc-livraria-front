"use client";
import {LivroProps} from "@/app/(app)/detalhaLivro/LivroProps";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import api from "@/services/api";
import Image from "next/image";
import {toast} from "sonner";
import Navbar from "@/components/Navbar";

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
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-12">
                {livros.map((livro) => (
                    <div key={livro.id} className="rounded-lg flex flex-col items-center">
                        {livro.imagemUrl && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_URL_BACK}/${livro.imagemUrl}`}
                                alt={livro.titulo}
                                width={200}
                                height={300}
                                className={`rounded-lg shadow-lg transform hover:scale-105 
                                transition-transform duration-300 ease-in-out object-cover`}
                                unoptimized={true}
                                priority={true}
                            />
                        )}
                        <div className="mt-4 text-center">
                            <h2 className="text-lg text-white font-bold">{livro.titulo}</h2>
                            <p className="text-white font-bold">Autor: {livro.autor}</p>
                            <p className="text-white font-bold">Ano: {livro.ano}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
