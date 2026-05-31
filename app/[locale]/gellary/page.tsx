"use client";

import { useState, useEffect } from "react";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";
import Lenta from "@/components/modals/gallery_scroll";

interface PhotoItem {
    png: string;
    title: string;
    alt?: string;
    width?: number;
    height?: number;
}

type Messages = {
    picture?: PhotoItem[];
};

export default function Gallery() {
    const t = useTranslations();
    const messages = useMessages() as Messages;

    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mounted, setMounted] = useState(false);

    const photos = messages?.picture ?? [];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setIsDarkMode(savedTheme !== "light");
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-neutral-950" />;
    }

    return (
        <main
            className={`p-8 min-h-screen flex flex-col justify-between transition-colors duration-300 ${
                isDarkMode
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-black"
            }`}
        >
            <div>
                <h1 className="text-3xl font-bold mb-12 text-center">
                    Gallery
                </h1>

                {/* Исправленный Masonry grid через CSS Grid */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-0
                               auto-rows-[10px] w-full max-w-7xl mx-auto"
                >
                    {photos.map((item, index) => {
                        const width = item.width ?? 1;
                        const height = item.height ?? 1;
                        const aspectRatio = width / height;

                        const safeRatio =
                            Number.isFinite(aspectRatio) && aspectRatio > 0
                                ? aspectRatio
                                : 1;

                        /* ФОРМУЛА ДЛЯ CSS GRID MASONRY:
                          Считаем сколько рядов по 10px займет картинка (например, при ширине ~280px).
                          Добавляем фиксированное количество рядов под паддинги и текст (например, +10 рядов = 100px).
                        */
                        const approxWidth = 280;
                        const calculatedImgHeight = approxWidth / safeRatio;
                        const textAndPaddingHeight = 90; // Запас под отступы карточки и h2

                        const rowSpan = Math.ceil((calculatedImgHeight + textAndPaddingHeight) / 10);

                        return (
                            <div
                                key={`${item.png}-${index}`}
                                onClick={() => setActiveIndex(index)}
                                /* Важно: mb-8 здесь задает нижний отступ между карточками в одной колонке.
                                  Класс overflow-hidden убран, чтобы тени не обрезались, а скругление перенесено на картинку.
                                */
                                className="w-full pb-8 select-none break-inside-avoid"
                                style={{ gridRowEnd: `span ${rowSpan}` }}
                            >
                                <div
                                    className={`group cursor-pointer rounded-3xl p-4
                                               transition-all duration-300 hover:scale-[1.02] transform-gpu backface-hidden
                                               active:scale-[0.98] h-full flex flex-col justify-between
                                               ${
                                        isDarkMode
                                            ? "bg-neutral-800 border border-neutral-700 shadow-2xl shadow-black/70"
                                            : "bg-white border border-neutral-200 shadow-xl shadow-black/10"
                                    }`}
                                >
                                    {/* Контейнер картинки — ТЕПЕРЬ С ASPECT RATIO */}
                                    <div
                                        className={`relative overflow-hidden rounded-2xl w-full transition-all duration-500
                                            ${isDarkMode ? "border border-neutral-600 bg-neutral-900" : "border border-neutral-300 bg-neutral-50"}`}
                                        style={{ aspectRatio: safeRatio }}
                                    >
                                        <Image
                                            src={item.png}
                                            alt={item.alt || item.title || "Gallery image"}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
                                            priority={index < 3}
                                            loading={index < 3 ? "eager" : "lazy"}
                                        />
                                    </div>

                                    {/* Блок текста */}
                                    <div className="pt-4 pb-1">
                                        <h2 className="text-sm font-bold text-center tracking-widest uppercase opacity-90">
                                            {item.title}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            <Lenta
                activeIndex={activeIndex}
                onClose={() => setActiveIndex(null)}
            />

            {/* Footer */}
            <footer
                className={`mt-20 pt-8 border-t text-center text-xs space-y-1 max-w-2xl mx-auto w-full transition-colors ${
                    isDarkMode
                        ? "border-neutral-800 text-neutral-500"
                        : "border-neutral-200 text-neutral-400"
                }`}
            >
                <p>{t("disclaimer_text")}</p>
                <p>{t("disclaimer_copyright")}</p>
            </footer>
        </main>
    );
}