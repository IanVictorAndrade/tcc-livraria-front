"use client";
import Navbar from "@/components/Navbar";
import {useState} from "react";

export default function Perfil() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <Navbar/>
    )
}