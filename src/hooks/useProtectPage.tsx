"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useProtectPage = () => {
    const { role, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && role === "ROLE_USER") {
            router.push("/home");
        }
    }, [role, isAuthenticated, router]);
};