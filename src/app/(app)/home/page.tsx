"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import Image from "next/image";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { LivroProps } from "@/@types/utils/LivroProps";
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Home() {
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const [livroIndex, setLivroIndex] = useState(0);
    const [expandirDescricao, setExpandirDescricao] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { token } = useAuth();

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
    };

    async function comprarLivro(livro: LivroProps) {
        const payload = {
            id: livro.id,
            title: livro.titulo,
            description: livro.descricao,
            category_id: "entertainment",
            quantity: 1,
            currencyId: "BRL",
            unitPrice: livro.preco
        };
        try {
            const response = await api.post('/mercado-pago/link-pagamento', payload, {
                headers: { Authorization: `${token}` }
            });
            window.open(response.data);
        } catch {
            toast.error('Erro ao comprar o livro');
        }
    }

    const mudarLivro = (index: number) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setLivroIndex(index);
            setExpandirDescricao(false);
            setIsTransitioning(false);
        }, 400); // Tempo da animação
    };

    if (livros.length === 0) {
        return <p className="text-gray-700 text-center mt-20 text-2xl">Carregando livros...</p>;
    }

    const livro = livros[livroIndex];

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center px-10 py-10">
                <div className="w-full max-w-[1400px] flex flex-nowrap items-center justify-between gap-10">

                    {/* Capa do livro centralizada */}
                    <div className="w-[500px] flex items-center justify-center">
                        {livro.imagemUrl && (
                            <div className={`transform transition-all duration-500 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_URL_BACK}/${livro.imagemUrl}`}
                                    alt={livro.titulo}
                                    width={500}
                                    height={700}
                                    className="rounded-lg shadow-lg object-contain"
                                    unoptimized={true}
                                    priority={true}
                                />
                            </div>
                        )}
                    </div>

                    {/* Informações do livro com transição */}
                    <div className={`w-full max-w-[700px] text-left text-gray-900 transform transition-all duration-500 ${isTransitioning ? "opacity-0 translate-x-5" : "opacity-100 translate-x-0"}`}>
                        <h2 className="text-6xl font-bold mb-6 uppercase">{livro.titulo}</h2>
                        <p className="text-3xl font-semibold mb-4">Autor: <span className="font-normal">{livro.autor}</span></p>

                        {/* Descrição formatada */}
                        <div className={`relative overflow-hidden transition-all duration-500 ${expandirDescricao ? "max-h-[1000px]" : "max-h-[220px]"}`}>
                            <div className="whitespace-normal break-words text-2xl leading-relaxed text-gray-800 mb-6">
                                {livro.descricao}
                            </div>
                        </div>

                        {/* Botão de seta para expandir/recolher a descrição */}
                        {livro.descricao.length > 230 && (
                            <button
                                className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900 transition-colors duration-300"
                                onClick={() => setExpandirDescricao(!expandirDescricao)}
                            >
                                {expandirDescricao ? (
                                    <IoIosArrowUp className="text-3xl" />
                                ) : (
                                    <IoIosArrowDown className="text-3xl" />
                                )}
                            </button>
                        )}

                        <p className="text-4xl font-bold mb-6 text-gray-900">
                            Preço: R$ {livro.preco.toFixed(2)}
                        </p>

                        <button
                            onClick={() => comprarLivro(livro)}
                            className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-2xl transition duration-300"
                        >
                            Comprar
                        </button>
                    </div>
                </div>

                {/* Navegação para próximo e anterior - Agora FIXA no meio da tela */}
                {livroIndex > 0 && (
                    <button
                        onClick={() => mudarLivro(livroIndex - 1)}
                        className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 text-black text-5xl hover:text-gray-500 transition-opacity"
                    >
                        <IoIosArrowBack />
                    </button>
                )}
                {livroIndex < livros.length - 1 && (
                    <button
                        onClick={() => mudarLivro(livroIndex + 1)}
                        className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 text-black text-5xl hover:text-gray-500 transition-opacity"
                    >
                        <IoIosArrowForward />
                    </button>
                )}
            </div>
        </div>
    );
}