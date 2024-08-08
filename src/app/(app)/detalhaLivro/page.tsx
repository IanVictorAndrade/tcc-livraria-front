"use client";
import {useState} from "react";
import { LivroProps } from './LivroProps';
import api from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";

export default function DetalhaLivro() {
    const [livro, setLivro] = useState<LivroProps>();
    const { token } = useAuth();

    const bodyForLivro = {
        titulo: string;
        description: string;
        pictureUrl: string;
        categoryId: string;
        quantity: number;
        unitPrice: number;
        currencyId: string;
    }

    const fetchLinkPagamento = async () => {
        const response = await api.post('/mercado-pago/link-pagamento',
        bodyForLivro,
                {
            headers: { Authorization: `${token}` }
        })
    }

    return (
        <div>
            <h1 className="bold text-2xl text-center">DetalhaLivro</h1>
            <div className="flex flex-col">
                <p className="">Título do livro</p>
                <p>Autor</p>
                <p>Preço</p>
                <p>Ano de publicação</p>
                <p>Descrição</p>
                <button className="flex mt-20 text-2xl">Comprar</button>
            </div>
        </div>
    )
}