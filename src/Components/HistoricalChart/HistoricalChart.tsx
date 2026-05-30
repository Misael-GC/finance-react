// src/Components/HistoricalChart/HistoricalChart.tsx
import { useUI } from '../../Context/UIContext';
import { marketService } from '../../Services/marketService';
import { useAsyncData } from '../../Hooks/useAsyncData';
import Card from '../Card/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoricalChart() {
  const { apiToken } = useUI();

  // Abstraemos por completo la consulta asíncrona mediante nuestro Hook Genérico
  const { data: chartData, loading, error } = useAsyncData(async () => {
    if (!apiToken) return [];
    return await marketService.getHistoricalData(apiToken, 'WALMEX*');
  }, [apiToken]);

  return (
    <Card title="Series Históricas" subtitle="WALMEX* /v2/historicos" titleHref="/historicos">
      <div className="w-full h-[160px] min-w-0 mt-4 relative block">
        
        {/* ================= CONTROL DE ESTADOS DE LA INTERFAZ ================= */}
        {loading ? (
          /* 1. SKELETON LOADER EN FORMA DE GRÁFICA (Mismos colores de barra) */
          <div className="absolute inset-0 flex flex-col justify-between animate-pulse pb-2">
            {/* Simulación del área interna de la gráfica con líneas horizontales */}
            <div className="w-full h-[120px] flex flex-col justify-between pl-8 pr-2">
              <div className="h-[1px] bg-slate-800 w-full" />
              {/* Barra simulando una tendencia en carga */}
              <div className="h-6 bg-slate-700/40 rounded-full w-2/3 ml-12 rotate-[2deg] blur-[1px]" />
              <div className="h-[1px] bg-slate-800 w-full" />
              <div className="h-[1px] bg-slate-800 w-full" />
            </div>
            
            {/* Simulación de las etiquetas de los ejes X e Y */}
            <div className="flex justify-between items-center text-[9px] px-1 text-transparent select-none mt-1">
              <div className="w-10 h-2 bg-slate-700 rounded" />
              <div className="w-14 h-2 bg-slate-700 rounded" />
              <div className="w-14 h-2 bg-slate-700 rounded" />
              <div className="w-12 h-2 bg-slate-700 rounded" />
            </div>
          </div>
        ) : error ? (
          /* 2. ESTADO DE ERROR FINANCIERO ESTILIZADO */
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center space-x-2 max-w-[320px] shadow-sm">
              <span className="text-rose-400 text-sm">⚠️</span>
              <p className="text-rose-400 text-xs font-medium truncate" title={error}>
                {error}
              </p>
            </div>
          </div>
        ) : !chartData || chartData.length === 0 ? (
          /* 3. ESTADO VACÍO REGISTRO INACTIVO */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-lg text-center">
              <span className="text-slate-500 text-sm block mb-1" role="img" aria-label="empty">📉</span>
              <p className="text-slate-500 text-xs italic">Sin registros de cotización históricos.</p>
            </div>
          </div>
        ) : (
          /* 4. FLUJO PRINCIPAL EXITOSO CON RENDIMIENTO ÓPTIMO */
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={9}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ color: '#22d3ee', fontSize: '12px' }}
                formatter={(value: any) => [`$${value}`, 'Cierre']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#22d3ee" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

      </div>
    </Card>
  );
}