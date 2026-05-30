"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const handleLanguageChange = (nextLocale: "ru" | "en") => {
        router.replace(pathname, { locale: nextLocale });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

            if (scrolledToBottom) {
                // Исправлено: перенаправляем на относительный роут
                router.push("/gellary");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);

    return (
        // Исправлено: h-[200vh] для скролла, flex для центрирования контента
        <main className="h-[120vh] bg-neutral-950 text-white flex flex-col justify-between p-8">
            {/* Кнопки переключения языков в верхнем углу */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => handleLanguageChange("ru")}
                    className={`px-3 py-1 rounded ${locale === "ru" ? "bg-white text-black font-bold" : "bg-neutral-800"}`}
                >
                    ru
                </button>
                <button
                    onClick={() => handleLanguageChange("en")}
                    className={`px-3 py-1 rounded ${locale === "en" ? "bg-white text-black font-bold" : "bg-neutral-800"}`}
                >
                    en
                </button>
            </div>

            {/* Исправлено: название сайта теперь строго посередине экрана */}
            <div className="flex-1 flex items-center justify-center">
                <article className="text-6xl font-serif tracking-widest uppercase animate-pulse">
                    Gallery
                </article>
            </div>

            {/* Подсказка для скролла в самом низу */}
            <div className="text-center text-neutral-400 animate-bounce pb-10">
                <p>Scroll to explore ↓</p>
            </div>
        </main>
    );
}
