"use client"

import { useState, useEffect } from "react";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import Lenta from "@/components/modals/gallery_scroll";

// Описание интерфейса для строгой типизации данных из JSON
interface PhotoItem {
    png: string;
    title: string;
    alt?: string;
    width?: number;
    height?: number;
}

export default function Gallery() {
    const t = useTranslations();
    const messages = useMessages();

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [mounted, setMounted] = useState<boolean>(false);

    // Безопасное приведение типов, исключающее ошибки компиляции TypeScript
    const photo = (messages as unknown as { picture?: PhotoItem[] })?.picture ?? [];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDarkMode(false);
        }
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-neutral-950" />;
    }

    return (
        <main className={`p-8 min-h-screen flex flex-col justify-between transition-colors duration-300 ${
            isDarkMode ? "bg-neutral-900 text-white" : "bg-neutral-50 text-black"
        }`}>
            <div>
                <h1 className="text-3xl font-bold mb-10 text-center">Gallery</h1>

                {/* Pinterest-раскладка (Masonry) через CSS Columns */}
                <div className="columns-1 sm:columns-2 md:columns-3 gap-8 space-y-8 [column-fill:_balance] w-full max-w-7xl mx-auto">
                    {photo.map((item, index) => {
                        // Вычисляем пропорцию (aspect ratio) на основе данных из JSON.
                        // Если данных нет, используем безопасный дефолт 1 (квадрат).
                        const aspectRatio = item.width && item.height ? item.width / item.height : 1;

                        return (
                            <div
                                key={item.png || index}
                                onClick={() => setActiveIndex(index)}
                                /* break-inside-avoid — не дает разрывать карточку между колонками.
                                  transform-gpu и backface-hidden — фиксируют композитные слои в браузере,
                                  что предотвращает "исчезновение" или сдвиг соседних карточек (например, Дали) при ховере.
                                */
                                className={`group break-inside-avoid block cursor-pointer rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] transform-gpu backface-hidden select-none mb-8
                                    ${isDarkMode
                                    ? "bg-neutral-800 border border-neutral-700 shadow-xl shadow-black/60"
                                    : "bg-white border border-neutral-200 shadow-lg shadow-black/10"
                                }`}
                            >
                                {/* Контейнер картинки с фиксированной пропорцией стороны */}
                                <div
                                    className={`relative overflow-hidden rounded-xl transition-all duration-500 
                                        ${isDarkMode ? "border border-neutral-600 bg-neutral-900" : "border border-neutral-300 bg-neutral-50"}`}
                                    /* Передаем пропорцию инлайном. Контейнер займет нужную высоту до загрузки картинки */
                                    style={{ aspectRatio: aspectRatio }}
                                >
                                    <Image
                                        src={item.png}
                                        alt={item.alt || item.title || "Gallery image"}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        /* object-cover заполняет блок.
                                          transform-gpu здесь дублирует аппаратное ускорение для самого изображения.
                                        */
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"

                                        // Оптимизация приоритетов загрузки Next.js
                                        priority={index < 3}
                                        loading={index < 3 ? "eager" : "lazy"}
                                    />
                                </div>

                                <h2 className="text-sm font-bold text-center mt-4 tracking-widest uppercase opacity-90">
                                    {item.title}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Lenta
                activeIndex={activeIndex}
                onClose={() => setActiveIndex(null)}
            />

            <footer className={`mt-16 pt-8 border-t text-center text-xs space-y-1 max-w-2xl mx-auto w-full transition-colors ${
                isDarkMode ? "border-neutral-800 text-neutral-500" : "border-neutral-200 text-neutral-400"
            }`}>
                <p>{t("disclaimer_text")}</p>
                <p>{t("disclaimer_copyright")}</p>
            </footer>
        </main>
    );
}