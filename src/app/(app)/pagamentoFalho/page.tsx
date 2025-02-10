"use client";
import { Home, ErrorOutline } from "@mui/icons-material";
import { Button, Container, Paper, Typography, Box } from "@mui/material";

export default function PagamentoFalhou() {
    return (
        <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
            <Paper elevation={4} className="p-8 text-center rounded-lg">
                {/* Ícone de erro animado */}
                <Box className="flex justify-center">
                    <ErrorOutline sx={{ fontSize: 80, color: "red", animation: "shake 0.8s infinite" }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="textPrimary" className="mt-4">
                    Pagamento Falhou!
                </Typography>

                <Typography variant="body1" color="textSecondary" className="mt-2">
                    Ocorreu um problema ao processar seu pagamento. Caso tenha sido cobrado indevidamente, entre em contato com o suporte.
                </Typography>

                {/* Botão para voltar à Home */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Home />}
                    href="/home"
                    className="mt-6"
                >
                    Voltar para Home
                </Button>
            </Paper>
        </Container>
    );
}
