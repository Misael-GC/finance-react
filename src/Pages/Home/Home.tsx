import { useState, useEffect } from 'react';
import Card from '../../Components/Card/Card'; 

export default function Home() {
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIndices([
        { ticker: 'SSP 500', u: 5500.20, c: 1.5 },
        { ticker: 'NASDAQ', u: 15200.50, c: 1.5 },
        { ticker: 'IPC MÉXICO', u: 55100.10, c: -0.5 },
        { ticker: 'DAX', u: 16100.80, c: 0.8 },
        { ticker: 'FTSE 100', u: 7500.20, c: 0.6 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-4">
      
      {/* 1. BARRA SUPERIOR Y ESTADO (Indicadores Globales) */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading ? <p className="text-slate-400">Cargando indicadores...</p> : indices.map((ind, index) => (
          <div key={index} className="flex-shrink-0 flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg">
            <span className="text-sm font-bold text-white">{ind.ticker}:</span>
            <span className="text-sm text-slate-300">{ind.u}</span>
            <span className={`text-xs font-bold ${ind.c > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({ind.c > 0 ? '+' : ''}{ind.c}%) {ind.c > 0 ? '▲' : '▼'}
            </span>
          </div>
        ))}
      </div>

      {/* 2. CONTENIDO PRINCIPAL: Grid de 4 columnas (Proporción 1 - 2 - 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        
        {/* COLUMNA IZQUIERDA: Panel de Mercado y Rankings (Ocupa 1/4) */}
        <div className="flex flex-col space-y-2 lg:col-span-1">
          <Card title="Top de Emisoras" subtitle="Mercado Local/Global">
            <ul className="space-y-3 mt-2">
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-white">WALMEX</span>
                <span className="text-emerald-400">+3.1%</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-white">AMX</span>
                <span className="text-rose-400">-1.5%</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span className="text-white">CEMEX</span>
                <span className="text-emerald-400">+3.0%</span>
              </li>
            </ul>
          </Card>

          <Card title="Monitor de Divisas" subtitle="Tipos de Cambio">
            <ul className="space-y-3 mt-2">
              <li className="flex justify-between">
                <span className="text-white">USD/MXN</span>
                <span className="text-emerald-400">17.10 (+0.1%)</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white">EUR/MXN</span>
                <span className="text-emerald-400">18.50 (+0.2%)</span>
              </li>
            </ul>
          </Card>

          <Card title="Commodities">
            <ul className="space-y-3 mt-2">
              <li className="flex justify-between">
                <span className="text-white">Petróleo WTI</span>
                <span className="text-emerald-400">$85.10</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white">Oro</span>
                <span className="text-rose-400">$1,350.00</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* COLUMNA CENTRAL: Gráficos y Análisis (Ocupa 2/4) */}
        <div className="flex flex-col lg:col-span-2">
          {/* Al envolver el Card en un div, podemos forzar su altura mínima */}
          <div className="min-h-[20rem] flex flex-col h-full">
            <Card title="Gráficos Intradía" subtitle="/v2/intradia">
              <div className="flex items-center justify-center h-48 border border-dashed border-slate-600 rounded-lg mt-4">
                <p className="text-slate-500">Componente de Velas Japonesas (TradingView / Recharts)</p>
              </div>
            </Card>
          </div>

          <div className="min-h-[16rem] flex flex-col">
            <Card title="Series Históricas" subtitle="/v2/historicos">
              <div className="flex items-center justify-center h-32 border border-dashed border-slate-600 rounded-lg mt-4">
                <p className="text-slate-500">Gráfico de líneas a largo plazo</p>
              </div>
            </Card>
          </div>
        </div>

        {/* COLUMNA DERECHA: Detalle de Emisora y Datos (Ocupa 1/4) */}
        <div className="flex flex-col space-y-2 lg:col-span-1">
          <Card title="Perfil de la Empresa" subtitle="/v2/emisoras">
            <div className="mt-2 text-xs space-y-2">
              <p><strong className="text-white">Emisora:</strong> WALMEX</p>
              <p><strong className="text-white">Razón Social:</strong> Wal-Mart de México, S.A.B.</p>
              <p><strong className="text-white">Sector:</strong> Consumo Frecuente</p>
            </div>
          </Card>

          <Card title="Análisis Fundamental" subtitle="/v2/financieros">
            <div className="mt-2 text-xs space-y-2 text-cyan-400 cursor-pointer">
              <p className="hover:text-cyan-300">Estados de Situación Financiera →</p>
              <p className="hover:text-cyan-300">Flujos de Efectivo →</p>
              <p className="hover:text-cyan-300">Resultados Trimestrales →</p>
            </div>
          </Card>

          <Card title="Registro de Hechos" subtitle="/v2/hechos">
             <div className="mt-2 text-xs">
              <p className="text-white font-medium">WALMEX Serie A</p>
              <p>Precio: $72.35 | Vol: 300</p>
              <p className="text-slate-500">Hora: 10:30:45</p>
             </div>
          </Card>
        </div>

      </div>

      {/* 3. SECCIÓN INFERIOR: Feed de Noticias y Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ">
        <Card title="Titulares de Negocios" subtitle="/v2/noticias">
          <ul className="space-y-3 mt-2 text-sm">
            <li><strong className="text-cyan-400">El Economista:</strong> Banxico mantiene tasa de interés...</li>
            <li><strong className="text-cyan-400">Reforma:</strong> Economía mexicana crece 3.5%...</li>
          </ul>
        </Card>

        <Card title="Cables de Emisoras" subtitle="/v2/cables">
          <ul className="space-y-3  text-sm">
            <li><strong className="text-emerald-400">WALMEX:</strong> Evento flash: Reporte de ventas supera expectativas.</li>
            <li><strong className="text-emerald-400">CEMEX:</strong> Valuación reciente indica potencial...</li>
          </ul>
        </Card>
      </div>

    </div>
  );
}