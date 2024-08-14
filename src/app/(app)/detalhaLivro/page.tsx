"use client";
import {useEffect, useState} from "react";
import {LivroProps} from './LivroProps';
import api from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";


export default function DetalhaLivro() {
    const [livros, setLivros] = useState<Array<LivroProps>>([]);
    const {token} = useAuth();

    useEffect(() => {
        listaLivros();
    }, [token]);

    const listaLivros = async () => {
        const response = await api.get('/livro/listar', {
            headers: {Authorization: `${token}`}
        });
        setLivros(response.data);
    }
    async function comprarLivro(livro: LivroProps) {
        const payload = {
            id: livro.id,
            title: livro.titulo,
            description: `${livro.descricao}`,
            category_id: "entertainment",
            quantity: 1,
            currencyId: "BRL",
            unitPrice: 42.99,
        }
        const response = await api.post('/mercado-pago/link-pagamento', payload, {
            headers: { Authorization: `${token}` }
        });

        window.open(response.data)
    }

    return (
        <div>
            <h1 className="bold text-2xl text-center">Detalha Livro</h1>
            {livros.map((livro) => (
                <div className="flex flex-col" key={livro.id}>
                    <p className="">{livro.titulo}</p>
                    <p>{livro.autor}</p>
                    <p>{livro.preco}</p>
                    <p>{livro.ano}</p>
                    <p>{livro.descricao}</p>
                    <button className="flex mt-20 text-2xl" onClick={() => comprarLivro(livro)}>Comprar</button>
                </div>
            ))}
        </div>
    )
}