"use client"

import React, { useEffect, useState, useRef } from "react";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";

type ModalProps = {
    activeIndex: number | null;
    onClose: () => void;
}

export default function Lenta({ activeIndex, onClose }: ModalProps) {
    const t = useTranslations();
    const messages = useMessages();
    const picturesArray = (messages as any)?.picture || [];

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const fullScreenContainerRef = useRef<HTMLDivElement>(null);

    // Состояние темы для модального окна
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Считываем тему при каждом открытии модалки или смене картинки
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setIsDarkMode(false);
        } else {
            setIsDarkMode(true);
        }
        setIsFullScreen(false);
        setIsZoomed(false);
    }, [activeIndex]);

    // Закрытие по кнопке Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isFullScreen) {
                    setIsFullScreen(false);
                    setIsZoomed(false);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, isFullScreen]);

    if (activeIndex === null || !picturesArray[activeIndex]) return null;

    const currentPicture = picturesArray[activeIndex];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !fullScreenContainerRef.current) return;

        const { left, top, width, height } = fullScreenContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setMousePos({ x, y });
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
        >
            {/* Контейнер стандартного модального окна с динамической темой */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl transition-colors duration-300 scrollbar-thin ${
                    isDarkMode
                        ? "bg-neutral-800 border border-neutral-700 text-white"
                        : "bg-white border border-neutral-200 text-black"
                }`}
            >
                {/* Кнопка закрытия модалки */}
                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 text-2xl transition-colors z-10 ${
                        isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"
                    }`}
                >
                    &times;
                </button>

                {/* Название картины сверху */}
                <h2 className="text-2xl font-bold mb-6 text-center pr-6 font-serif">
                    {currentPicture.title}
                </h2>

                {/* Двухколоночная сетка */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Превью картинки */}
                    <div
                        onClick={() => setIsFullScreen(true)}
                        className={`relative w-full h-72 md:h-auto min-h-[300px] flex items-center justify-center rounded-lg overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity ${
                            isDarkMode ? "bg-neutral-900" : "bg-neutral-100"
                        }`}
                    >
                        <Image
                            src={currentPicture.png}
                            alt={currentPicture.alt || currentPicture.title}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    {/* Текстовый блок */}
                    <div className="flex flex-col justify-between space-y-4">
                        <p className={`text-sm leading-relaxed max-h-[250px] overflow-y-auto pr-2 ${
                            isDarkMode ? "text-neutral-300" : "text-neutral-600"
                        }`}>
                            {currentPicture.history_and_about}
                        </p>

                        <div className={`border-t pt-4 space-y-2 text-sm ${
                            isDarkMode ? "border-neutral-700" : "border-neutral-200"
                        }`}>
                            <p>
                                <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>
                                    {t("year_label")}:
                                </span>{" "}
                                <span className="font-medium">{currentPicture.year}</span>
                            </p>
                            <p>
                                <span className={isDarkMode ? "text-neutral-400" : "text-neutral-500"}>
                                    {t("author_label")}:
                                </span>{" "}
                                <span className={`font-semibold ${isDarkMode ? "text-neutral-200" : "text-neutral-800"}`}>
                                    {currentPicture.author}
                                </span>
                            </p>

                            {/* Дополнительная плашка */}
                            {currentPicture.additional_parts && currentPicture.additional_parts !== "Нет." && (
                                <p className={`text-xs italic p-2 rounded mt-2 ${
                                    isDarkMode ? "bg-neutral-900/50 text-neutral-400" : "bg-neutral-100 text-neutral-600"
                                }`}>
                                    {currentPicture.additional_parts}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ПОЛНОЭКРАННЫЙ РЕЖИМ (ЛАЙТБОКС) --- */}
            {isFullScreen && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFullScreen(false);
                        setIsZoomed(false);
                    }}
                    className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 cursor-pointer"
                >
                    {/* Кнопка закрытия */}
                    <button
                        onClick={() => {
                            setIsFullScreen(false);
                            setIsZoomed(false);
                        }}
                        className="absolute top-6 right-6 text-white text-4xl hover:text-neutral-400 transition-colors z-20"
                    >
                        &times;
                    </button>

                    {/* Название картины */}
                    <div className="absolute top-6 left-6 text-neutral-400 text-lg font-medium hidden md:block">
                        {currentPicture.title}
                    </div>

                    {/* Контейнер зума */}
                    <div
                        ref={fullScreenContainerRef}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                        onMouseMove={handleMouseMove}
                        className={`relative w-full h-[80vh] max-w-5xl overflow-hidden rounded-lg select-none ${
                            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                        }`}
                    >
                        <div
                            className="absolute inset-0 transition-transform duration-200 ease-out"
                            style={{
                                transform: isZoomed ? `scale(3)` : `scale(1)`,
                                transformOrigin: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : "center",
                            }}
                        >
                            <Image
                                src={currentPicture.png}
                                alt={currentPicture.alt || currentPicture.title}
                                fill
                                className="object-contain"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </div>

                    {/* Подсказка снизу */}
                    <div className="absolute bottom-6 text-xs text-neutral-500 text-center pointer-events-none">
                        {isZoomed ? t("zoom_out_hint") : t("zoom_in_hint")}
                    </div>
                </div>
            )}
        </div>
    );
}