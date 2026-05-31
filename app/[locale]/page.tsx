"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations();

    const [isDarkMode, setIsDarkMode] = useState(true);
    // Дополнительное состояние, чтобы избежать конфликтов гидратации SSR/CSR
    const [mounted, setMounted] = useState(false);

    // Читаем тему и ставим флаг mounted только на клиенте
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

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

            if (scrolledToBottom) {
                // ВНИМАНИЕ: Проверь, как называется папка в app: gallery или gellary
                router.push("/gellary");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);

    // Если мы еще не на клиенте (компонент не примонтирован),
    // рендерим пустую оболочку или базовое состояние, чтобы не ломать разметку Next.js
    if (!mounted) {
        return <div className="h-screen w-full bg-neutral-950" />;
    }

    return (
        <main className={`relative h-screen w-full flex items-center justify-center p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-neutral-950 text-white" : "bg-neutral-50 text-black"
        }`}>

            {/* 1. Переключение языков СВЕРХУ В ПРАВОМ УГЛУ */}
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

            {/* 2. Название сайта СТРОГО ПОСЕРЕДИНЕ */}
            <article className="text-6xl md:text-8xl font-serif tracking-widest uppercase select-none">
                Gallery
            </article>

            {/* 3. Переключение цвета экрана СЛЕВА ВНИЗУ */}
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

            {/* 4. Информация о прокрутке СПРАВА ВНИЗУ */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 animate-pulse select-none z-10">
                <span>Scroll to explore</span>
                <span className="text-base animate-bounce">↓</span>
            </div>

        </main>
    );
}