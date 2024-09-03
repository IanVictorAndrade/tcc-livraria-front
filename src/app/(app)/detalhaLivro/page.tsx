"use client";
import {LivroProps} from '@/@types/utils/LivroProps';
import api from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";


export default function DetalhaLivro() {
    const {token} = useAuth();


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
            <button>Comprar</button>
        </div>
    )
}