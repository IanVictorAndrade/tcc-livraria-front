"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/services/api";
import { Button, Container, Paper, Typography, Box } from "@mui/material";
import { CheckCircle, Download, Home } from "@mui/icons-material";

export default function PagamentoSucesso() {
    const searchParams = useSearchParams();
    const livroId = searchParams.get("livroId");
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    const [fileId, setFileId] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (status === "approved" && livroId && paymentId) {
            api.get(`/google-drive/obterFileId/${livroId}`)
                .then((res) => {
                    setFileId(res.data.fileId);
                })
                .catch(() => {
                    setErro("Erro ao obter arquivo do livro.");
                });
        } else {
            setErro("Pagamento não confirmado.");
        }
    }, [livroId, paymentId, status]);

    async function baixarLivro() {
        if (fileId) {
            try {
                const resp = await api.get(`/google-drive/download/${fileId}`, {
                    responseType: "blob", // Indica que estamos recebendo um arquivo
                });

                // Criar um Blob com os dados do arquivo
                const blob = new Blob([resp.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                // Criar um link invisível para o download
                const a = document.createElement("a");
                a.href = url;
                a.download = "livro.pdf"; // Nome do arquivo ao baixar
                document.body.appendChild(a);
                a.click();

                // Limpar o URL temporário
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch {
                setErro("Erro ao baixar o livro.");
            }
        }
    }

    return (
        <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
            <Paper elevation={4} className="p-8 text-center rounded-lg">
                <Box className="flex justify-center">
                    <CheckCircle sx={{ fontSize: 80, color: "green" }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="textPrimary" className="mt-4">
                    Pagamento Realizado com Sucesso!
                </Typography>

                <Typography variant="body1" color="textSecondary" className="mt-2">
                    Obrigado por sua compra! Clique no botão abaixo para baixar seu livro.
                </Typography>

                {erro ? (
                    <Typography variant="body1" color="error" className="mt-4">
                        {erro}
                    </Typography>
                ) : (
                    status === "approved" && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Download />}
                            onClick={baixarLivro}
                            className="mt-6"
                        >
                            Baixar Livro
                        </Button>
                    )
                )}

                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Home />}
                    href="/home"
                    className="mt-4"
                >
                    Voltar para Home
                </Button>
            </Paper>
        </Container>
    );
}
