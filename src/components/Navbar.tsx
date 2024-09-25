"use client";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from "react";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/background-roxo')"}}>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <a href="/home" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Home
                                </a>
                                <a href="/gerenciaLivro" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Gerenciar Livro
                                </a>
                                <a href="/gerenciaUsuario" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Gerenciar Usuário
                                </a>
                                <a href="#" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Biografia
                                </a>
                                <a href="/equipe" className="text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Equipe
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Perfil */}
                    <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:pr-0">
                        <div className="relative">
                            <button
                                type="button"
                                className={`p-1 rounded-full outline-none focus:outline-none ${
                                    isDropdownOpen ? "text-blue-500" : "text-white"
                                } hover:text-blue-500`}
                                onClick={toggleDropdown}
                            >
                                <AccountCircleIcon />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </a>
                                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Settings
                                    </a>
                                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Log Out
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
