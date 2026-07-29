import React, { useState, useEffect } from 'react';
import Card from '../../Components/Card/Card';
import MarketRankingList from '../../Components/MarketRankingList/MarketRankingList';
import IntradayChart from '../../Components/IntradayChart/IntradayChart';
import HistoricalChart from '../../Components/HistoricalChart/HistoricalChart';
import { marketService } from '../../Services/marketService';

export default function LocalMarket() {
  const token = import.meta.env.VITE_DATABURSATIL_TOKEN || '';
  const [cables, setCables] = useState<{ title: string; source: string; url: string; date: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchCables = async () => {
      try {
        if (!token) return;
        setIsLoading(true);
        const data = await marketService.getCables(token);
        if (mounted) {
          setCables(data.slice(0, 10)); // Top 10 cables
        }
      } catch (error) {
        console.error("Failed to fetch cables:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCables();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="space-y-4">
      
      {/* 1. Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Mercado Mexicano</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Tasas de referencia, top de emisoras y análisis de la BMV.</p>
      </div>

      {/* 2. Grid Principal: 4 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUMNA IZQUIERDA: Tasas y Rankings (Ocupa 1/4) */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <MarketRankingList 
            title="Tasas de Referencia"
            subtitle="Banco de México"
            titleHref="/tasas"
            fetchData={marketService.getTasas}
          />
          <MarketRankingList 
            title="Top Emisoras Locales"
            subtitle="BMV y BIVA"
            titleHref="/emisoras"
            fetchData={(token) => marketService.getTopIssuers(token, 'local')}
          />
        </div>

        {/* COLUMNA CENTRAL: Gráficos (Ocupa 2/4) */}
        <div className="flex flex-col lg:col-span-2">
          <div className="min-h-[20rem] flex flex-col">
            <IntradayChart ticker="BOLSA A" />
          </div>
          <div className="flex flex-col h-full mt-4">
            <HistoricalChart ticker="BOLSA A" />
          </div>
        </div>

        {/* COLUMNA DERECHA: Divisas MXN (Ocupa 1/4) */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <MarketRankingList 
            title="Tipo de Cambio"
            subtitle="USD/MXN y Cruces"
            titleHref="/forex"
            fetchData={marketService.getForexMXN}
          />
        </div>

      </div>

      {/* 3. SECCIÓN INFERIOR: Feed de Cables BMV */}
      <div className="grid grid-cols-1">
        <Card title="Cables y Reportes Corporativos (BMV)" subtitle="/v2/cables">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <span className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : (
              <ul className="space-y-4 text-sm">
                {cables.length > 0 ? (
                  cables.map((item, idx) => (
                    <li key={idx} className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0">
                      <a href={item.url} target="_blank" rel="noreferrer" className="block group">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 block">
                          {item.source} <span className="text-slate-400 dark:text-slate-500 font-normal">| {item.date}</span>
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium transition-colors">
                          {item.title}
                        </span>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No hay cables disponibles en este momento.</li>
                )}
              </ul>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}