// src/Components/MarketTrades/MarketTrades.tsx
import { useUI } from '../../Context/UIContext';
import { marketService } from '../../Services/marketService';
import { useAsyncData } from '../../Hooks/useAsyncData';
import Card from '../Card/Card';

export default function MarketTrades() {
  const { apiToken } = useUI();

  // Consumo genérico de datos asíncronos mediante nuestro Hook
  const { data: trades, loading, error } = useAsyncData(async () => {
    if (!apiToken) return [];
    const response = await marketService.getMarketTrades(apiToken, 'WALMEX*');
    return response.slice(0, 5);
  }, [apiToken]);

  return (
    <Card title="Registro de Hechos" subtitle="WALMEX* /v2/hechos" titleHref="/hechos">
      <div className="mt-3 w-full overflow-hidden">
        <div className="space-y-2.5">
          
          {/* ================= ENCABEZADO DE TABLA FIJO (Siempre visible para excelente UX) ================= */}
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
            <span className="w-1/4">Hora</span>
            <span className="w-1/4 text-right">Precio</span>
            <span className="w-1/4 text-right">Vol</span>
            <span className="w-1/4 text-right">C / V</span>
          </div>

          {/* ================= CONTROL DE ESTADOS DE LA INTERFAZ ================= */}
          {loading ? (
            /* 1. SKELETON LOADER (Mismos colores de barra homologados) */
            <div className="space-y-1.5 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={`trade-skeleton-${i}`} 
                  className="flex justify-between items-center h-[26px] bg-slate-900/10 px-1 py-1 rounded"
                >
                  {/* Columna Hora */}
                  <div className="w-1/6 h-2.5 bg-slate-700 rounded" />
                  {/* Columna Precio */}
                  <div className="w-1/5 h-2.5 bg-slate-700 rounded ml-auto" />
                  {/* Columna Volumen */}
                  <div className="w-1/6 h-2.5 bg-slate-700 rounded ml-auto" />
                  {/* Columna Comprador / Vendedor */}
                  <div className="w-1/4 h-2.5 bg-slate-700/50 rounded ml-auto" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* 2. ESTADO DE ERROR FINANCIERO ESTILIZADO */
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex flex-col items-center justify-center text-center shadow-sm w-full">
              <span className="text-rose-400 text-base mb-1" role="img" aria-label="error">⚠️</span>
              <h4 className="text-rose-400 text-xs font-semibold tracking-wide uppercase">Error de Conexión</h4>
              <p className="text-slate-400 text-[11px] mt-0.5 max-w-[240px] truncate font-mono" title={error}>
                {error}
              </p>
            </div>
          ) : !trades || trades.length === 0 ? (
            /* 3. ESTADO VACÍO REGISTRO INACTIVO */
            <div className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-lg flex flex-col items-center justify-center text-center w-full">
              <span className="text-slate-500 text-sm mb-1" role="img" aria-label="empty">📋</span>
              <h4 className="text-slate-400 text-xs font-medium">Registro Inactivo</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Sin operaciones ejecutadas hoy
              </p>
            </div>
          ) : (
            /* 4. FLUJO EXITOSO CON RENDIMIENTO ÓPTIMO */
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
          )}

        </div>
      </div>
    </Card>
  );
}