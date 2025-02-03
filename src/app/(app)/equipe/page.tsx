"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import Image from "next/image";
import ReactCardFlip from "react-card-flip";
import foto_equipe_fabio from "/public/foto_equipe_fabio.jpg";
import foto_equipe_livia from "/public/foto_equipe_livia.jpg";
import foto_equipe_ian from "/public/foto_equipe_ian.jpeg";

export default function Equipe() {
    const [isFlippedIan, setIsFlippedIan] = useState(false);
    const [isFlippedFabio, setIsFlippedFabio] = useState(false);
    const [isFlippedLivia, setIsFlippedLivia] = useState(false);

    return (
        <>
            <Navbar/>
            <div className="flex flex-col text-2xl items-center my-4">
                <h1>Conheça a equipe</h1>
                <p>Pessoas que colaboraram para a concretização do projeto.</p>
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-14 px-6">

                    {/* Card - Ian */}
                    <ReactCardFlip isFlipped={isFlippedIan} flipDirection="vertical">
                        <div key="front" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_ian} alt="desenvolvedor do site" width={220} height={220}/>
                            <div>
                                <h2 className="font-semibold text-black text-xl mt-6">Ian Victor</h2>
                                <p className="text-gray-600">Desenvolvedor</p>
                            </div>
                            <button onClick={() => setIsFlippedIan(!isFlippedIan)} className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                                Ver mais
                            </button>
                        </div>
                        <div key="back" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <h2 className="font-semibold text-black text-xl mt-6">Ian Victor</h2>
                            <p className="text-gray-600">Responsável pelo desenvolvimento do site.</p>
                            <button onClick={() => setIsFlippedIan(!isFlippedIan)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Voltar
                            </button>
                        </div>
                    </ReactCardFlip>

                    {/* Card - Fabio */}
                    <ReactCardFlip isFlipped={isFlippedFabio} flipDirection="vertical">
                        <div key="front" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_fabio} alt="equipe do livro" width={220} height={220}/>
                            <div>
                                <h2 className="font-semibold text-black text-xl mt-6">Fabio Marcelo Tanwing Saavedra</h2>
                                <p className="text-gray-600">Autor</p>
                            </div>
                            <button onClick={() => setIsFlippedFabio(!isFlippedFabio)} className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                                Ver mais
                            </button>
                        </div>
                        <div key="back" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <h2 className="font-semibold text-black text-xl mt-6">Fabio Marcelo Tanwing Saavedra</h2>
                            <p className="text-gray-600">Autor do livro e colaborador do projeto.</p>
                            <button onClick={() => setIsFlippedFabio(!isFlippedFabio)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Voltar
                            </button>
                        </div>
                    </ReactCardFlip>

                    {/* Card - Lívia */}
                    <ReactCardFlip isFlipped={isFlippedLivia} flipDirection="vertical">
                        <div key="front" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <Image className="rounded-full border-4 border-pink-500" src={foto_equipe_livia} alt="equipe do livro" width={220} height={220}/>
                            <div>
                                <h2 className="font-semibold text-black text-xl mt-6">Lívia Catarina</h2>
                                <p className="text-gray-600">Organizadora</p>
                            </div>
                            <button onClick={() => setIsFlippedLivia(!isFlippedLivia)} className="bg-pink-500 text-white px-4 py-2 rounded-lg">
                                Ver mais
                            </button>
                        </div>
                        <div key="back" className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center text-center w-[400px] h-[500px] justify-between">
                            <h2 className="font-semibold text-black text-xl mt-6">Lívia Catarina</h2>
                            <p className="text-gray-600">Organizou e coordenou as etapas do projeto.</p>
                            <button onClick={() => setIsFlippedLivia(!isFlippedLivia)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                                Voltar
                            </button>
                        </div>
                    </ReactCardFlip>

                </div>
            </div>
        </>
    );
}
