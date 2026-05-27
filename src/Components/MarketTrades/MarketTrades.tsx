import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type TradeItem } from '../../Services/marketService';
import Card from '../Card/Card';

export default function MarketTrades() {
  const { apiToken } = useUI();
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrades() {
      if (!apiToken) return;

      try {
        setLoading(true);
        setError(null);
        const data = await marketService.getMarketTrades(apiToken, 'WALMEX*');
        console.log('Datos de Hechos recibidos:', data);
        if (isMounted) {
          // Tomamos los primeros 5 hechos para mantener el Widget estilizado en la barra lateral
          setTrades(data.slice(0, 5));
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Cinta no disponible');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTrades();

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  return (
    <Card title="Registro de Hechos" subtitle="WALMEX* /v2/hechos" titleHref="/hechos">
      <div className="mt-3 w-full overflow-hidden">
        {loading ? (
          <p className="text-slate-400 text-xs animate-pulse py-2">Escaneando transacciones de libro...</p>
        ) : error ? (
          <p className="text-rose-400 text-xs py-2">{error}</p>
        ) : trades.length === 0 ? (
          <p className="text-slate-500 text-xs py-2">Sin operaciones ejecutadas hoy</p>
        ) : (
          <div className="space-y-2.5">
            {/* Encabezado sutil */}
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
              <span className="w-1/4">Hora</span>
              <span className="w-1/4 text-right">Precio</span>
              <span className="w-1/4 text-right">Vol</span>
              <span className="w-1/4 text-right">C / V</span>
            </div>

            {/* Listado de Ticks */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-hide">
              {trades.map((trade) => (
                <div 
                  key={trade.id} 
                  className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/30 hover:bg-slate-700/30 px-1 py-1 rounded transition-colors duration-150"
                >
                  <span className="w-1/4 font-mono text-slate-400 text-[11px]">{trade.time}</span>
                  <span className="w-1/4 text-right font-medium text-white font-mono">${trade.price.toFixed(2)}</span>
                  <span className="w-1/4 text-right font-mono text-cyan-400">{trade.volume}</span>
                  <span className="w-1/4 text-right text-[10px] font-mono text-slate-400 tracking-tighter">
                    {trade.buyer} <span className="text-slate-600">›</span> {trade.seller}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}