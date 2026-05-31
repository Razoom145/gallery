"use client"

import { useState, useEffect } from "react";
import { useMessages, useTranslations } from "next-intl";
import Lenta from "@/components/modals/gallery_scroll";

export default function Gallery() {
    const t = useTranslations();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Состояние темы (по умолчанию темная, пока не проверили localStorage)
    const [isDarkMode, setIsDarkMode] = useState(true);

    const messages = useMessages();
    const photo = (messages as any)?.picture || [];

    // Читаем сохраненную тему при загрузке страницы
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDarkMode(false);
        }
    }, []);

    return (
        <main className={`p-8 min-h-screen flex flex-col justify-between transition-colors duration-300 ${
            isDarkMode ? "bg-neutral-900 text-white" : "bg-neutral-50 text-black"
        }`}>
            <div>
                <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>

                {/* Раскладка в стиле Pinterest (Masonry) */}
                <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full max-w-7xl mx-auto">
                    {photo.map((item: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            /* 3D-объем: жесткие черные рамки, внутренние блики (inset) и мягкие глубокие внешние тени */
                            className={`break-inside-avoid block cursor-pointer border rounded-xl p-4 transition-all duration-300 mb-6 hover:scale-[1.03] select-none ${
                                isDarkMode
                                    ? "bg-neutral-800 border-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.7),_inset_0_1px_2px_rgba(255,255,255,0.2),_inset_0_-1px_2px_rgba(0,0,0,0.4)]"
                                    : "bg-white border-neutral-900 text-black shadow-[0_10px_25px_rgba(0,0,0,0.15),_inset_0_1px_3px_rgba(255,255,255,0.8),_inset_0_-1px_2px_rgba(0,0,0,0.1)]"
                            }`}
                        >
                            {/* Контейнер картинки с эффектом объемной наклейки */}
                            <div className={`w-full mb-4 overflow-hidden rounded-lg border-2 border-black/40 transition-shadow duration-300 ${
                                isDarkMode
                                    ? "shadow-[0_4px_10px_rgba(0,0,0,0.5),_inset_0_2px_4px_rgba(255,255,255,0.15)]"
                                    : "shadow-[0_4px_8px_rgba(0,0,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.6)]"
                            }`}>
                                <img
                                    src={item.png}
                                    alt={item.alt || item.title}
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <h2 className="text-sm font-bold text-center mt-2 tracking-wide uppercase opacity-90">
                                {item.title}
                            </h2>
                        </div>
                    ))}
                </div>
            </div>

            {/* Наша модалка */}
            <Lenta
                activeIndex={activeIndex}
                onClose={() => setActiveIndex(null)}
            />

            {/* Футер с оформлением */}
            <footer className={`mt-16 pt-8 border-t text-center text-xs space-y-1 max-w-2xl mx-auto w-full transition-colors ${
                isDarkMode ? "border-neutral-800 text-neutral-500" : "border-neutral-200 text-neutral-400"
            }`}>
                <p>{t("disclaimer_text")}</p>
                <p>{t("disclaimer_copyright")}</p>
            </footer>
        </main>
    );
}