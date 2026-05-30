"use client"

import React, { useEffect } from "react";
import { useMessages, useTranslations } from "next-intl";
import Image from "next/image";

type ModalProps = {
    activeIndex: number | null;
    onClose: () => void;
}

export default function Lenta({ activeIndex, onClose }: ModalProps) {
    // Получаем переводы для лейблов с верхнего уровня JSON
    const t = useTranslations();

    // Безопасно достаем массив картинок через useMessages
    const messages = useMessages();
    const picturesArray = (messages as any)?.picture || [];

    // Если модалка закрыта или индекс не валиден — ничего не рендерим


    // Закрытие по кнопке Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (activeIndex === null || !picturesArray[activeIndex]) return null;

    const currentPicture = picturesArray[activeIndex];

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
            {/* Контейнер модального окна */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-neutral-800 border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl text-white scrollbar-thin"
            >
                {/* Кнопка закрытия (крестик) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl transition-colors"
                >
                    &times;
                </button>

                {/* 1. Название картины сверху */}
                <h2 className="text-2xl font-bold mb-6 text-center pr-6">
                    {currentPicture.title}
                </h2>

                {/* Двухколоночная сетка: картинка + инфо */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 2. Сама картина */}
                    <div className="relative w-full h-72 md:h-auto min-h-[300px] flex items-center justify-center bg-neutral-900 rounded-lg overflow-hidden">
                        <Image
                            src={currentPicture.png}
                            alt={currentPicture.alt || currentPicture.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    {/* Текстовый блок (правая колонка) */}
                    <div className="flex flex-col justify-between space-y-4">
                        {/* 3. Описание картины */}
                        <p className="text-neutral-300 text-sm leading-relaxed max-h-[250px] overflow-y-auto pr-2">
                            {currentPicture.history_and_about}
                        </p>

                        <div className="border-t border-neutral-700 pt-4 space-y-2 text-sm">
                            {/* 4. Год написания */}
                            <p>
                                <span className="text-neutral-400">{t("year_label")}:</span>{" "}
                                <span className="font-medium">{currentPicture.year}</span>
                            </p>

                            {/* 5. Автор */}
                            <p>
                                <span className="text-neutral-400">{t("author_label")}:</span>{" "}
                                <span className="font-semibold text-neutral-200">{currentPicture.author}</span>
                            </p>

                            {/* Дополнительно: Если есть информация о частях/трилогии */}
                            {currentPicture.additional_parts && currentPicture.additional_parts !== "Нет." && (
                                <p className="text-xs text-neutral-400 italic bg-neutral-900/50 p-2 rounded mt-2">
                                    {currentPicture.additional_parts}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}