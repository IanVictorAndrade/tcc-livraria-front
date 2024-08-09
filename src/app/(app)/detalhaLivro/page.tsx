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
        console.log(response.data);
    }

    // const fetchLinkPagamento = async () => {
    //     const response = await api.post('/mercado-pago/link-pagamento',
    //     bodyForLivro,
    //             {
    //         headers: { Authorization: `${token}` }
    //     })
    // }

    async function comprarLivro(livro: LivroProps) {
        console.log('Comprar livro', livro);
        const payload = {
            id: livro.id,
            title: livro.titulo,
            description: `Descrição do livro ${livro.titulo}`,
            teste: "ian"
        }
        console.log(payload);
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
                    <p>TESTE DE DESCRIÇÃO</p>
                    <button className="flex mt-20 text-2xl" onClick={() => comprarLivro(livro)}>Comprar</button>
                </div>
            ))}
        </div>
    )
}