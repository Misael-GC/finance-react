import { useUI } from '../../Context/UIContext';
import { marketService } from '../../Services/marketService';
import { useAsyncData } from '../../Hooks/useAsyncData';
import Card from '../Card/Card';

export default function MarketTrades() {
  const { apiToken } = useUI();

  const { data: trades, loading, error } = useAsyncData(async () => {
    if (!apiToken) return [];

    const response = await marketService.getMarketTrades(apiToken, 'WALMEX*');
    return response.slice(0, 5);
  }, [apiToken]);

  // 1. SKELETON DE CARGA (Mantiene la proporción visual y las filas de la tabla)
  if (loading) {
    return (
      <div className="w-full bg-slate-900/20 border border-slate-800/60 rounded-xl p-4 animate-pulse">
        {/* Simulación del header del Card */}
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-1" />
        <div className="h-3 bg-slate-800/60 rounded w-1/2 mb-6" />

        <div className="space-y-3">
          {/* Simulación del encabezado interno */}
          <div className="flex justify-between px-1">
            <div className="w-12 h-2.5 bg-slate-800 rounded" />
            <div className="w-12 h-2.5 bg-slate-800 rounded" />
            <div className="w-10 h-2.5 bg-slate-800 rounded" />
            <div className="w-16 h-2.5 bg-slate-800 rounded" />
          </div>
          {/* Líneas simuladoras de los hechos reales */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center h-[26px] bg-slate-800/40 px-2 rounded">
              <div className="w-1/6 h-2 bg-slate-700/60 rounded" />
              <div className="w-1/5 h-2 bg-slate-700/80 rounded ml-auto" />
              <div className="w-1/6 h-2 bg-slate-700/60 rounded ml-auto" />
              <div className="w-1/4 h-2 bg-slate-700/40 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. ESTADO DE ERROR (Cuerpo estilizado con Tailwind)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-5 bg-rose-950/20 border border-rose-500/20 rounded-xl text-center shadow-sm w-full">
        <span className="text-rose-400 text-lg mb-1.5" role="img" aria-label="error">⚠️</span>
        <h4 className="text-rose-400 text-xs font-semibold tracking-wide uppercase">Error de Conexión</h4>
        <p className="text-slate-400 text-[11px] mt-1 max-w-[240px] leading-relaxed break-words font-mono" title={error}>
          {error}
        </p>
      </div>
    );
  }

  // 3. ESTADO SIN TRADES / VACÍO (Cuerpo estilizado con Tailwind)
  if (!trades || trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 border border-slate-800/80 rounded-xl text-center w-full">
        <span className="text-slate-500 text-base mb-1.5" role="img" aria-label="empty">📋</span>
        <h4 className="text-slate-400 text-xs font-medium">Registro Inactivo</h4>
        <p className="text-slate-500 text-[11px] mt-0.5">
          Sin operaciones ejecutadas hoy
        </p>
      </div>
    );
  }

  // 4. FLUJO PRINCIPAL CON EXITO (Renderiza la Card original sin modificaciones)
  return (
    <Card title="Registro de Hechos" subtitle="WALMEX* /v2/hechos" titleHref="/hechos">
      <div className="mt-3 w-full overflow-hidden">
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
      </div>
    </Card>
  );
}