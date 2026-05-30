"use client"

import { useState } from "react";
import { useMessages } from "next-intl";
import Image from "next/image";
import Lenta from "@/components/modals/gallery_scroll";

export default function Gallery() {
    // 1. Храним индекс выбранной картины (null — модалка закрыта)
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // 2. Подключаем локализацию и достаем массив картин (убрали дубль)
    const messages = useMessages();

    // Безопасно достаем массив picture из объекта локализации
    const photo = (messages as any)?.picture || [];

    return (
        <main className="p-8 min-h-screen bg-neutral-900 text-white">
            <h1 className="text-3xl font-bold mb-8 text-center">Моя Галерея</h1>

            {/* 3. Сетка карточек */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photo.map((item: any, index: number) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)} // Кликнули — запомнили индекс
                        className="cursor-pointer border border-neutral-700 rounded-lg p-4 bg-neutral-800 hover:scale-105 transition-transform duration-200"
                    >
                        <div className="relative w-full h-64 mb-4">
                            <Image
                                src={item.png}
                                alt={item.alt || item.title}
                                fill
                                className="object-cover rounded-md"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-center">{item.title}</h2>
                    </div>
                ))}
            </div>

            {/* 4. Наша модалка, которая ждет индекс */}
            <Lenta
                activeIndex={activeIndex}
                onClose={() => setActiveIndex(null)}
            />
        </main>
    );
}