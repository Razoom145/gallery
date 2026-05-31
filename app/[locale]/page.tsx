"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// 1. Добавили пропущенный интерфейс для TS
interface PhotoItem {
    png: string;
    title?: string;
    alt?: string;
    width?: number;
    height?: number;
}

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations();
    const messages = useMessages();
    const photo = ((messages as { picture?: PhotoItem[] }).picture ?? []);

    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mounted, setMounted] = useState(false);
    const hasNavigatedRef = useRef(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDarkMode(false);
        }
        setMounted(true);
    }, []);

    const handleLanguageChange = (nextLocale: "ru" | "en") => {
        router.replace(pathname, { locale: nextLocale });
    };

    const toggleTheme = () => {
        const nextTheme = !isDarkMode;
        setIsDarkMode(nextTheme);
        localStorage.setItem("theme", nextTheme ? "dark" : "light");
    };

    // 2. Исправили опечатку в /gallery и сделали один вызов при монтировании
    useEffect(() => {
        router.prefetch("/gallery");
    }, []);

    // 3. Оптимизировали логику скролла
    useEffect(() => {
        const handleScroll = () => {
            if (hasNavigatedRef.current) return;

            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50; // 50px запас для удобства

            if (scrolledToBottom) {
                hasNavigatedRef.current = true;
                // Сразу удаляем слушатель, чтобы не спамить роутер
                window.removeEventListener("scroll", handleScroll);
                router.push("/gellary"); // Исправлено на /gallery
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);

    if (!mounted) {
        return <div className="h-screen w-full bg-neutral-950" />;
    }

    return (
        /* 4. Изменили h-screen на min-h-[101vh], чтобы физически появился скролл */
        <main className={`relative min-h-[101vh] w-full flex items-center justify-center p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-neutral-950 text-white" : "bg-neutral-50 text-black"
        }`}>

            {/* Переключение языков */}
            <div className="absolute top-8 right-8 flex gap-3 z-10">
                <button
                    onClick={() => handleLanguageChange("ru")}
                    className={`px-3 py-1 text-sm rounded border transition-colors ${
                        locale === "ru"
                            ? (isDarkMode ? "bg-white text-black font-bold border-white" : "bg-black text-white font-bold border-black")
                            : "bg-transparent border-neutral-600 text-neutral-400 hover:text-current"
                    }`}
                >
                    ru
                </button>
                <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-3 py-1 text-sm rounded border transition-colors ${
                        locale === "en"
                            ? (isDarkMode ? "bg-white text-black font-bold border-white" : "bg-black text-white font-bold border-black")
                            : "bg-transparent border-neutral-600 text-neutral-400 hover:text-current"
                    }`}
                >
                    en
                </button>
            </div>

            {/* Название сайта */}
            <article className="text-6xl md:text-8xl font-serif tracking-widest uppercase select-none">
                Gallery
            </article>

            {/* Переключение темы */}
            <div className="absolute bottom-8 left-8 z-10">
                <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase border shadow-sm transition-all active:scale-95 ${
                        isDarkMode
                            ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                            : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-100"
                    }`}
                >
                    {isDarkMode ? "Light Mode ☼" : "Dark Mode ☾"}
                </button>
            </div>

            {/* Информация о прокрутке */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 animate-pulse select-none z-10">
                <span>Scroll to explore</span>
                <span className="text-base animate-bounce">↓</span>
            </div>

            {/* Скрытый предзагрузчик картинок */}
            <div className="hidden">
                {photo.slice(0, 6).map((item) => (
                    <Image
                        key={item.png}
                        src={item.png}
                        alt=""
                        width={100}
                        height={100}
                        priority
                    />
                ))}
            </div>
        </main>
    );
}