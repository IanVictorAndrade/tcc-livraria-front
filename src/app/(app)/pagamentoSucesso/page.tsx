"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { CheckCircle, FileDownload, Home } from "@mui/icons-material";
import { Button, Container, Paper, Typography, Box } from "@mui/material";

export default function PagamentoSucesso() {
    const searchParams = useSearchParams();
    const livroId = searchParams.get("livroId");

    useEffect(() => {
        if (livroId) {
            baixarLivro(livroId);
        }
    }, [livroId]);

    const baixarLivro = async (livroId: string) => {
        try {
            const response = await api.get(`/mercado-pago/download?livroId=${livroId}`);
            if (response.data.downloadUrl) {
                window.location.href = response.data.downloadUrl;
            }
        } catch (error) {
            console.error("Erro ao baixar livro", error);
        }
    };

    return (
        <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
            <Paper elevation={4} className="p-8 text-center rounded-lg">
                {/* Ícone de sucesso animado */}
                <Box className="flex justify-center">
                    <CheckCircle sx={{ fontSize: 80, color: "green", animation: "bounce 1s infinite" }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="textPrimary" className="mt-4">
                    Pagamento Aprovado!
                </Typography>

                <Typography variant="body1" color="textSecondary" className="mt-2">
                    Seu pagamento foi confirmado. Agora você pode baixar seu livro digital.
                </Typography>

                <div className={"flex justify-center items-center gap-2 mt-6"}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<FileDownload />}
                        href={`/mercado-pago/download?livroId=${livroId}`}
                    >
                        Baixar Livro
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Home />}
                        href="/home"
                    >
                        Voltar para Home
                    </Button>
                </div>
            </Paper>
        </Container>
    );
}
