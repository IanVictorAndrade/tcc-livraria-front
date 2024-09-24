"use client";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import api from "@/services/api";
import Image from "next/image";
import {toast} from "sonner";
import Navbar from "@/components/Navbar";
import {LivroProps} from "@/@types/utils/LivroProps";

export default function Home() {
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const [livroIndex, setLivroIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const {token} = useAuth();

    useEffect(() => {
        listaLivros();
    }, [token]);

    const listaLivros = async () => {
        try {
            const response = await api.get('/livro/listar', {
                headers: { Authorization: `${token}` }
            });
            const sortedLivros = response.data.sort((a: LivroProps, b: LivroProps) => a.titulo.localeCompare(b.titulo));
            setLivros(sortedLivros);
        } catch {
            window.location.href = '/';
            toast.error('Necessário fazer o login para acessar a página');
        }
    }

    async function comprarLivro(livro: LivroProps) {
        const payload = {
            id: livro.id,
            title: livro.titulo,
            description: livro.descricao,
            category_id: "entertainment",
            quantity: 1,
            currencyId: "BRL",
            unitPrice: 42.99
        }
        try {
            const response = await api.post('/mercado-pago/link-pagamento', payload, {
                headers: { Authorization: `${token}` }
            });

            window.open(response.data)
        } catch {
            toast.error('Erro ao comprar o livro');
        }
    }

    const livro = livros[livroIndex];

    const proximoLivro = () => {
        if (livroIndex < livros.length - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setLivroIndex(livroIndex + 1);
                setIsTransitioning(false);
            }, 500); // Duração da animação
        }
    };

    const livroAnterior = () => {
        if (livroIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
                setLivroIndex(livroIndex - 1);
                setIsTransitioning(false);
            }, 500);
        }
    };



    if (livros.length === 0) {
        return <p className="text-white">Carregando livros...</p>;
    }

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center mt-12">
                {/* Informações do livro */}
                <div className={`w-1/3 p-8 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    <h2 className="text-4xl text-white font-bold mb-6">{livro.titulo}</h2>
                    <p className="text-2xl text-white font-bold mb-4">Autor: {livro.autor}</p>
                    <p className="text-2xl text-white font-bold mb-4">Ano: {livro.ano}</p>
                    <p className="text-xl text-white mb-6">{livro.descricao}</p>
                    <p className="text-3xl text-white font-bold mb-6">Preço: R$ {livro.preco.toFixed(2)}</p>
                    <button onClick={() => comprarLivro(livro)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-xl">
                        Comprar
                    </button>
                </div>

                {/* Imagem do livro e navegação */}
                <div className={`w-2/3 flex justify-center items-center relative transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {livro.imagemUrl && (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_URL_BACK}/${livro.imagemUrl}`}
                            alt={livro.titulo}
                            width={450}
                            height={600}
                            className="rounded-lg shadow-lg object-cover"
                            unoptimized={true}
                            priority={true}
                        />
                    )}

                    {/* Navegação para próximo e anterior */}
                    {livroIndex > 0 && (
                        <button
                            onClick={livroAnterior}
                            className="absolute left-0 text-white text-4xl p-3 hover:text-gray-300 transition-opacity opacity-70 hover:opacity-100"
                            style={{ backgroundColor: 'transparent' }}
                        >
                            ⬅
                        </button>
                    )}
                    {livroIndex < livros.length - 1 && (
                        <button
                            onClick={proximoLivro}
                            className="absolute right-0 text-white text-4xl p-3 hover:text-gray-300 transition-opacity opacity-70 hover:opacity-100"
                            style={{ backgroundColor: 'transparent' }}
                        >
                            ➡
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
