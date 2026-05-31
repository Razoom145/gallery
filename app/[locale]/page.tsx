"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { useEffect, useState, useRef, useTransition } from "react";
import Image from "next/image";

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
    const [isPending, startTransition] = useTransition();

    // Переводим анимацию в CSS-стадию: 'idle' | 'fading-out'
    const [fadeState, setFadeState] = useState<'idle' | 'fading-out'>('idle');

    const hasNavigatedRef = useRef(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") setIsDarkMode(false);
        setMounted(true);
    }, []);

    // Плавное переключение языка через Fade-анимацию
    const handleLanguageChange = (nextLocale: "ru" | "en") => {
        if (nextLocale === locale || fadeState === "fading-out") return;

        setFadeState("fading-out");

        setTimeout(() => {
            startTransition(() => {
                router.replace(pathname, { locale: nextLocale });
            });
        }, 300);
    };

    const toggleTheme = () => {
        const nextTheme = !isDarkMode;
        setIsDarkMode(nextTheme);
        localStorage.setItem("theme", nextTheme ? "dark" : "light");
    };

    // Prefetch страницы галереи
    useEffect(() => {
        router.prefetch("/gellary"); // Перепроверьте написание папки gellary/gallery в проекте!
    }, [router]);

    // Scroll to gallery
    useEffect(() => {
        const handleScroll = () => {
            if (hasNavigatedRef.current) return;

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
                hasNavigatedRef.current = true;
                window.removeEventListener("scroll", handleScroll);
                router.push("/gellary");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);

    useEffect(() => {
        if (!isPending && fadeState === "fading-out") {
            setFadeState("idle");
        }
    }, [isPending, fadeState]);

    // Чтобы избежать ошибки гидратации без черных экранов:
    // Показываем прозрачный экран с фоном текущей темы, пока клиент не подгрузился
    if (!mounted) {
        return null;
    }

    return (
        <main
            className={`relative min-h-[101vh] w-full flex items-center justify-center p-8 select-none
                /* Плавное изменение цвета темы */
                transition-colors duration-500 
                /* Элегантная CSS-анимация при изменении языка */
                transition-opacity duration-300 ease-in-out
                ${isDarkMode ? "bg-neutral-950 text-white" : "bg-neutral-50 text-black"} 
                ${fadeState === "fading-out" ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
        >
            {/* Переключение языков */}
            <div className="absolute top-8 right-8 flex gap-3 z-20">
                <button
                    onClick={() => handleLanguageChange("ru")}
                    disabled={fadeState === 'fading-out'}
                    className={`px-4 py-1.5 text-sm rounded border transition-all active:scale-95 ${
                        locale === "ru"
                            ? (isDarkMode ? "bg-white text-black font-bold border-white" : "bg-black text-white font-bold border-black")
                            : "bg-transparent border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-current"
                    }`}
                >
                    ru
                </button>
                <button
                    onClick={() => handleLanguageChange("en")}
                    disabled={fadeState === 'fading-out'}
                    className={`px-4 py-1.5 text-sm rounded border transition-all active:scale-95 ${
                        locale === "en"
                            ? (isDarkMode ? "bg-white text-black font-bold border-white" : "bg-black text-white font-bold border-black")
                            : "bg-transparent border-neutral-600 hover:border-neutral-400 text-neutral-400 hover:text-current"
                    }`}
                >
                    en
                </button>
            </div>

            {/* Название */}
            <article className="text-6xl md:text-8xl font-serif tracking-widest uppercase select-none">
                Gallery
            </article>

            {/* Переключение темы */}
            <div className="absolute bottom-8 left-8 z-20">
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

            {/* Scroll hint */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 animate-pulse select-none z-10">
                <span>Scroll to explore</span>
                <span className="text-base animate-bounce">↓</span>
            </div>

            {/* Предзагрузка изображений */}
            <div className="hidden">
                {photo.slice(0, 8).map((item) => (
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