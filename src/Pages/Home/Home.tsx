import { useState, useEffect } from 'react';
// Asumiendo que tienes un componente Card básico en src/Components/Card/Card.tsx
import Card from '../../Components/Card/Card'; 

export default function Home() {
  // Estados para simular la data de la API [10]
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulamos la llamada a la API [9, 11]
  useEffect(() => {
    // Aquí harías: fetch('https://api.databursatil.com/v2/indices?token=TU_TOKEN') [7, 12]
    setTimeout(() => {
      setIndices([
        { ticker: 'IPC', u: 54321.10, c: 1.2 },
        { ticker: 'S&P 500', u: 5200.45, c: 0.8 },
        { ticker: 'USD/MXN', u: 16.85, c: -0.5 },
        { ticker: 'PETROLEO', u: 82.30, c: 2.1 }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6 h-screen">
      <h2 className="text-2xl font-bold">Resumen de Mercado</h2>

      {/* Cinta de Indicadores (Top Bar) -> /v2/indices, /v2/divisas, /v2/commodities */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? <p>Cargando datos...</p> : indices.map((ind, index) => (
          <Card key={index} className="p-4 shadow-sm border border-slate-100 bg-white rounded-xl">
            <h3 className="text-sm text-slate-500 font-medium">{ind.ticker}</h3>
            <div className="flex items-end justify-between mt-2">
              <span className="text-2xl font-bold">{ind.u}</span>
              <span className={`text-sm font-medium ${ind.c > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ind.c > 0 ? '↑' : '↓'} {Math.abs(ind.c)}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Gráficos y Tablas Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Intradía -> /v2/intradia */}
        <Card className="col-span-2 p-6 shadow-sm border border-slate-100 bg-white rounded-xl h-96 flex items-center justify-center">
          <p className="text-slate-400">Aquí irá tu componente de gráfico (ej. Recharts o Chart.js)</p>
        </Card>

        {/* Principales Alzas y Bajas -> /v2/top */}
        <Card className="col-span-1 p-6 shadow-sm border border-slate-100 bg-white rounded-xl overflow-y-auto h-96">
          <h3 className="font-bold mb-4">Principales Movimientos (Top V2)</h3>
          <ul className="space-y-3">
             <li className="flex justify-between border-b pb-2">
               <span className="font-medium">CEMEXCPO</span>
               <span className="text-green-500">+3.4%</span>
             </li>
             <li className="flex justify-between border-b pb-2">
               <span className="font-medium">WALMEX</span>
               <span className="text-green-500">+2.1%</span>
             </li>
             <li className="flex justify-between border-b pb-2">
               <span className="font-medium">ALFAA</span>
               <span className="text-red-500">-1.8%</span>
             </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}