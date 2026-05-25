import { useState, useEffect } from 'react';
import './Globalindicators.css';

interface IndexItem {
  ticker: string;
  u: number;
  c: number;
}

export default function GlobalIndicators() {
  const [indices, setIndices] = useState<IndexItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndices([
        { ticker: 'SSP 500', u: 5500.20, c: 1.5 },
        { ticker: 'NASDAQ', u: 15200.50, c: 1.5 },
        { ticker: 'IPC MÉXICO', u: 55100.10, c: -0.5 },
        { ticker: 'DAX', u: 16100.80, c: 0.8 },
        { ticker: 'FTSE 100', u: 7500.20, c: 0.6 },
        { ticker: 'NIKKEI 225', u: 28000.50, c: -0.3 },
        { ticker: 'HANG SENG', u: 25000.10, c: 0.2 },
        { ticker: 'S&P/TSX', u: 20000.80, c: 0.4 },
        { ticker: 'IBEX 35', u: 9000.20, c: -0.1 },
        { ticker: 'CAC 40', u: 7000.50, c: 0.9 },
        { ticker: 'ASX 200', u: 7000.10, c: 0.3 },
      ]);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Limpieza del timeout si el componente se desmonta
  }, []);

  return (
    // <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide carousel">
    <div className="flex items-center space-x-4 pb-2 carousel w-[80%]">
      {loading ? (
        <p className="text-slate-400">Cargando indicadores...</p>
      ) : (
        indices.map((ind, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg groups"
          >
            <span className="text-sm font-bold text-white">{ind.ticker}:</span>
            <span className="text-sm text-slate-300">{ind.u}</span>
            <span className={`text-xs font-bold ${ind.c > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({ind.c > 0 ? '+' : ''}{ind.c}%) {ind.c > 0 ? '▲' : '▼'}
            </span>
          </div>
        ))
      )}
    </div>
  );
}