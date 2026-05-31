import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Укажи здесь реальный домен твоего сайта
    const baseUrl = 'https://theartgallery.vercel.app/';

    // Список твоих языков
    const locales = ['ru', 'en'];

    // Список всех роутов (страниц) в проекте
    // "" — главная страница, "gallery" — твоя галерея
    const routes = ['', 'gallery'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Генерируем ссылки для каждой страницы под каждый язык
    routes.forEach((route) => {
        locales.forEach((locale) => {
            // Формируем правильный путь, например: https://site.com/ru/gallery
            const url = `${baseUrl}/${locale}${route ? `/${route}` : ''}`;

            sitemapEntries.push({
                url: url,
                lastModified: new Date(), // Дата последнего изменения (ставим текущую)
                changeFrequency: route === 'gallery' ? 'weekly' : 'monthly', // Как часто обновляется контент
                priority: route === '' ? 1.0 : 0.8, // Приоритет страницы для робота (от 0.0 до 1.0)
            });
        });
    });

    return sitemapEntries;
}