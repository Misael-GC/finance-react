import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type IssuerTopItem } from '../../Services/marketService';
import Card from '../Card/Card';

export default function TopIssuers() {
  const { apiToken } = useUI();
  const [topList, setTopList] = useState<IssuerTopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTopData() {
      try {
        setLoading(true);
        setError(null);

        if (!apiToken) {
          console.warn("El token de la API aún no está disponible.");
          return;
        }

        const data = await marketService.getTopIssuers(apiToken);
        
        if (isMounted) {
          // Limitamos el render a los primeros 4 registros para mantener la UI compacta
          setTopList(data.slice(0, 4));
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
      loadTopData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  return (
    <Card title="Top de Emisoras" subtitle="Mercado Local/Global">
      {loading ? (
        <p className="text-slate-400 text-xs mt-2 animate-pulse">Cargando ranking...</p>
      ) : error ? (
        <p className="text-rose-400 text-xs mt-2">{error}</p>
      ) : topList.length === 0 ? (
        <p className="text-slate-500 text-xs mt-2">Sin variaciones registradas</p>
      ) : (
        <ul className="space-y-3 mt-2">
          {topList.map((item, index) => {
            const isPositive = item.percentageChange >= 0;
            const price = item.price ? `$${item.price.toFixed(2)}` : 'N/A';
            return (
              <li 
                key={`${item.ticker}-${index}`} 
                className="flex justify-between border-b border-slate-700 pb-2 last:border-none last:pb-0"
              >
                <span className="text-white font-medium text-sm">{item.ticker}</span>
                <span className={`text-white font-medium text-sm`}> 
                    {price ? '$' : ''}{item.price}
                </span>
                <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : ''}{item.percentageChange}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}