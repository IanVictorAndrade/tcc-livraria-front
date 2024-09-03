export interface UsuarioProps {
    id: number;
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    role: [
        {
            id: number;
            nome: string;
        }
    ]

}