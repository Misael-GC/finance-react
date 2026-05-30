// src/Components/MarketRankingList/MarketRankingList.tsx
import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { type MarketAssetItem } from '../../Services/marketService';
import Card from '../Card/Card';

interface MarketRankingListProps {
  title: string;
  subtitle: string;
  titleHref: string;
  fetchData: (token: string) => Promise<MarketAssetItem[]>;
}

export default function MarketRankingList({ title, subtitle, titleHref, fetchData }: MarketRankingListProps) {
  const { apiToken } = useUI();
  const [assets, setAssets] = useState<MarketAssetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        if (!apiToken) return;

        const data = await fetchData(apiToken);
        
        if (isMounted) {
          // Limitamos uniformemente a 3 elementos para diseño consistente
          setAssets(data.slice(0, 3));
        }
      } catch (err: any) {
        if (isMounted) {
          setError('No disponible');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (apiToken) {
      loadData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [apiToken, fetchData]);

  return (
    <Card title={title} subtitle={subtitle} titleHref={titleHref}>
      {loading ? (
        /* ================= SKELETON LOADER (NATIVO TAILWIND) ================= */
        <ul className="space-y-3 mt-2 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <li 
              key={`skeleton-${index}`} 
              className="flex justify-between items-center border-b border-slate-700 pb-2 last:border-none last:pb-0"
            >
              {/* Contenedor del Ticker ficticio */}
              <div className="h-4 bg-slate-700 rounded w-16" />
              {/* Contenedor del Precio ficticio */}
              <div className="h-4 bg-slate-700 rounded w-20" />
              {/* Contenedor del Porcentaje ficticio */}
              <div className="h-4 bg-slate-700 rounded w-12" />
            </li>
          ))}
        </ul>
      ) : error ? (
        /* ====== ESTADO DE ERROR ESTILIZADO CON UN CUERPO SUTIL ====== */
        <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-center space-x-2">
          <span className="text-rose-400 text-xs font-medium">⚠️ {error}</span>
        </div>
      ) : assets.length === 0 ? (
        /* ====== ESTADO DE DATOS VACÍOS ====== */
        <p className="text-slate-500 text-xs mt-2 italic">Sin variaciones registradas</p>
      ) : (
        /* ====== RENDERIZADO DE DATOS REALES ====== */
        <ul className="space-y-3 mt-2">
          {assets.map((item, index) => {
            const isPositive = item.percentageChange >= 0;
            const priceFormatted = item.price 
              ? `$${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` 
              : 'N/A';
            
            return (
              <li 
                key={`${item.ticker}-${index}`} 
                className="flex justify-between border-b border-slate-700 pb-2 last:border-none last:pb-0"
              >
                <span className="text-white font-medium text-sm">{item.ticker}</span>
                <span className="text-white font-medium text-sm"> 
                  {priceFormatted}
                </span>
                <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : ''}{item.percentageChange.toFixed(2)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}