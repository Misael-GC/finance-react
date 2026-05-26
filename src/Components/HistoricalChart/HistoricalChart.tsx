import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type HistoricalChartItem } from '../../Services/marketService';
import Card from '../Card/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoricalChart() {
  const { apiToken } = useUI();
  const [chartData, setChartData] = useState<HistoricalChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHistorical() {
      if (!apiToken) return;

      try {
        setLoading(true);
        setError(null);
        // Traemos el histórico de WALMEX*
        const data = await marketService.getHistoricalData(apiToken, 'WALMEX*');
        
        if (isMounted) {
          setChartData(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('No se pudieron cargar las series históricas.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadHistorical();

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  return (
    <Card title="Series Históricas" subtitle="WALMEX* /v2/historicos" titleHref="/historicos">
      <div className="w-full h-[160px] min-w-0 mt-4 relative block">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400 text-xs animate-pulse">Cargando series a largo plazo...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-rose-400 text-xs">⚠️ {error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 text-xs">Sin registros de cotización históricos.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              {/* Agregamos una cuadrícula muy sutil estilo terminal de trading */}
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
                stroke="#22d3ee" // cyan-400 para diferenciarlo visualmente del intradía
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