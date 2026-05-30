// src/Components/IntradayChart/IntradayChart.tsx
import { useUI } from '../../Context/UIContext';
import { marketService } from '../../Services/marketService';
import { useAsyncData } from '../../Hooks/useAsyncData';
import Card from '../Card/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function IntradayChart() {
  const { apiToken } = useUI();

  // Abstraemos por completo la consulta asíncrona mediante el Hook Genérico
  const { data: chartData, loading, error } = useAsyncData(async () => {
    if (!apiToken) return [];
    return await marketService.getIntradayData(apiToken, 'WALMEX*');
  }, [apiToken]);

  // Cálculos dinámicos de color (solo si hay datos disponibles)
  const safeData = chartData || [];
  const isUp = safeData.length > 1 ? safeData[safeData.length - 1].price >= safeData[0].price : true;
  const strokeColor = isUp ? '#34d399' : '#f87171';
  const fillColor = isUp ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)';

  return (
    <Card title="Gráficos Intradía" subtitle="WALMEX* /v2/intradia" titleHref="/intradia">
      <div className="w-full h-[220px] min-w-0 mt-4 relative block">
        
        {/* ================= CONTROL DE ESTADOS DE LA INTERFAZ ================= */}
        {loading ? (
          /* 1. SKELETON LOADER EN FORMA DE GRÁFICA INTRADÍA (Mismos colores homologados) */
          <div className="absolute inset-0 flex flex-col justify-between animate-pulse pb-2">
            {/* Simulación del área interna de la cuadrícula de trading */}
            <div className="w-full h-[180px] flex flex-col justify-between pl-8 pr-2">
              <div className="h-[1px] bg-slate-800/80 w-full" />
              <div className="h-[1px] bg-slate-800/80 w-full" />
              {/* Silueta de una curva de mercado sutil en carga */}
              <div className="h-8 bg-slate-700/30 rounded-full w-3/4 ml-6 -rotate-[1deg] blur-[1px]" />
              <div className="h-[1px] bg-slate-800/80 w-full" />
              <div className="h-[1px] bg-slate-800/80 w-full" />
            </div>
            
            {/* Simulación de marcadores temporales en el eje X inferior */}
            <div className="flex justify-between items-center text-[10px] px-2 text-transparent select-none mt-2">
              <div className="w-12 h-2 bg-slate-700 rounded" />
              <div className="w-12 h-2 bg-slate-700 rounded" />
              <div className="w-12 h-2 bg-slate-700 rounded" />
              <div className="w-12 h-2 bg-slate-700 rounded" />
            </div>
          </div>
        ) : error ? (
          /* 2. ESTADO DE ERROR FINANCIERO ESTILIZADO */
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center space-x-2 max-w-[340px] shadow-sm">
              <span className="text-rose-400 text-sm">⚠️</span>
              <p className="text-rose-400 text-xs font-medium truncate" title={error}>
                {error}
              </p>
            </div>
          </div>
        ) : safeData.length === 0 ? (
          /* 3. ESTADO VACÍO REGISTRO INACTIVO */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-lg text-center">
              <span className="text-slate-500 text-sm block mb-1" role="img" aria-label="empty">📉</span>
              <p className="text-slate-500 text-xs italic">No hay operaciones registradas para este periodo.</p>
            </div>
          </div>
        ) : (
          /* 4. FLUJO PRINCIPAL EXITOSO CON RECHARTS */
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={safeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ color: '#ffffff', fontSize: '12px' }}
                formatter={(value: any) => [`$${value}`, 'Precio']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={strokeColor} 
                fill={fillColor} 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

      </div>
    </Card>
  );
}