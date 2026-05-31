import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Получаем базовый URL твоего сайта из переменных окружения или пишем напрямую
    const baseUrl = 'https://theartgallery.vercel.app/';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/', // Разрешаем индексировать весь сайт
                disallow: [
                    '/*_next/*',       // Запрещаем системные файлы Next.js
                    '/api/*',          // Запрещаем серверные API-роуты (если они есть)
                    '*/studio/*',      // Запрещаем админки (если планируешь добавлять, например, Sanity/Strapi)
                    '/*.json$',        // Запрещаем индексировать конфигурационные JSON-файлы локализации
                ],
            },
        ],
        // Ссылка на карту сайта, которую поисковики запрашивают в первую очередь
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}