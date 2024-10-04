import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import foto_equipe_fabio from "/public/foto_equipe_fabio.jpg";
import foto_equipe_livia from "/public/foto_equipe_livia.jpg";
import foto_equipe_ian from "/public/foto_equipe_ian.jpeg";

export default function Equipe() {
    return (
        <>
            <Navbar/>
            <div className="flex flex-col text-2xl items-center my-4">
                <h1>Conheça a equipe</h1>
                <p>Pessoas que colaboraram para a concretização do projeto.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14 px-6">
                <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center text-center w-full max-w-md">
                    <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_ian} alt="desenvolvedor do site" width={200} height={200}/>
                    <h2 className="font-semibold text-black text-xl mt-6">Ian Victor</h2>
                    <p className="text-gray-600">Desenvolvedor</p>
                    {/*<p className="text-gray-500 text-base mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>*/}
                    <div className="flex gap-4 mt-6">
                        {/* Aqui você pode adicionar ícones de redes sociais */}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center text-center w-full max-w-md">
                    <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_fabio} alt="equipe do livro" width={200} height={200}/>
                    <h2 className="font-semibold text-black text-xl mt-6">Fabio Marcelo Tanwing Saavedra</h2>
                    <p className="text-gray-600">Autor</p>
                    {/*<p className="text-gray-500 text-base mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>*/}
                    <div className="flex gap-4 mt-6">
                        {/* Aqui você pode adicionar ícones de redes sociais */}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center text-center w-full max-w-md">
                    <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_livia} alt="equipe do livro" width={200} height={200}/>
                    <h2 className="font-semibold text-black text-xl mt-6">Lívia Catarina</h2>
                    <p className="text-gray-600">Organizadora</p>
                    {/*<p className="text-gray-500 text-base mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>*/}
                    <div className="flex gap-4 mt-6">
                        {/* Aqui você pode adicionar ícones de redes sociais */}
                    </div>
                </div>
            </div>
        </>
    )
}
