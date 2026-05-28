import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type IntradayChartItem } from '../../Services/marketService';
import Card from '../Card/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function IntradayChart() {
  const { apiToken } = useUI();
  const [chartData, setChartData] = useState<IntradayChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChart() {
      if (!apiToken) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await marketService.getIntradayData(apiToken, 'WALMEX*');
        
        if (isMounted) {
          setChartData(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('No se pudieron cargar los gráficos intradía. ' + (err.message || 'Error desconocido'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadChart();

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  const isUp = chartData.length > 1 ? chartData[chartData.length - 1].price >= chartData[0].price : true;
  const strokeColor = isUp ? '#34d399' : '#f87171';
  const fillColor = isUp ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)';

  return (
    <Card title="Gráficos Intradía" subtitle="WALMEX* /v2/intradia" titleHref="/intradia">
      {/* CORRECCIÓN CRÍTICA:
        Cambiamos h-52 por una altura explícitamente forzada en el div h-[220px],
        y le añadimos min-w-0 para evitar colapsos dentro de las grillas de Tailwind.
      */}
      <div className="w-full h-[220px] min-w-0 mt-4 relative block">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400 text-xs animate-pulse">Generando curva de mercado...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-rose-400 text-xs">⚠️ {error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 text-xs">No hay operaciones registradas para este periodo.</p>
          </div>
        ) : (
          /* Pasamos un height explícito numérico al contenedor de Recharts 
            para que no intente calcular dimensiones relativas del DOM mientras se monta.
          */
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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