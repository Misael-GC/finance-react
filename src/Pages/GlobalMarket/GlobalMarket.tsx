import React, { useState, useEffect } from 'react';
import Card from '../../Components/Card/Card';
import GlobalIndicators from '../../Components/GlobalIndicators/GlobalIndicators';
import MarketRankingList from '../../Components/MarketRankingList/MarketRankingList';
import { marketService } from '../../Services/marketService';
import { useUI } from '../../Context/UIContext';

export default function GlobalMarket() {
  const { theme } = useUI();
  const token = import.meta.env.VITE_DATABURSATIL_TOKEN || '';
  const [news, setNews] = useState<{ title: string; source: string; url: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        if (!token) return;
        setIsLoading(true);
        const data = await marketService.getNews(token);
        if (mounted) {
          setNews(data.slice(0, 8)); // Top 8 news
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNews();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="space-y-4">
      {/* 1. INDICADORES GLOBALES (Banderín superior) */}
      <GlobalIndicators />

      {/* 2. CONTENIDO PRINCIPAL: Mercados Globales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: SIC (Sistema Internacional de Cotizaciones) */}
        <div className="flex flex-col lg:col-span-1">
          <MarketRankingList 
            title="Mercado Global (SIC)"
            subtitle="Top de Acciones Internacionales"
            titleHref="/sic"
            fetchData={(token) => marketService.getTopIssuers(token, 'global')}
          />
        </div>

        {/* COLUMNA 2: Materias Primas */}
        <div className="flex flex-col lg:col-span-1">
          <MarketRankingList 
            title="Commodities"
            subtitle="Energía y Metales (USD)"
            titleHref="/commodities"
            fetchData={marketService.getCommodities}
          />
        </div>

        {/* COLUMNA 3: Mercado de Divisas */}
        <div className="flex flex-col lg:col-span-1">
          <MarketRankingList 
            title="Mercado FOREX"
            subtitle="Cruces de Divisas en Tiempo Real"
            titleHref="/forex"
            fetchData={marketService.getForex}
          />
        </div>

      </div>

      {/* 3. SECCIÓN INFERIOR: Feed de Noticias Macro */}
      <div className="grid grid-cols-1">
        <Card title="Noticias Internacionales y Cierre de Mercados" subtitle="/v2/noticias">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <span className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : (
              <ul className="space-y-4 text-sm">
                {news.length > 0 ? (
                  news.map((item, idx) => (
                    <li key={idx} className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
                      <a href={item.url} target="_blank" rel="noreferrer" className="block group">
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1 block">
                          {item.source} <span className="text-slate-400 dark:text-slate-500 font-normal">| {item.date}</span>
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 font-medium transition-colors">
                          {item.title}
                        </span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No hay noticias disponibles en este momento.</li>
                )}
              </ul>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}