
import Card from '../../Components/Card/Card';
import GlobalIndicators from '../../Components/GlobalIndicators/GlobalIndicators';
import MarketRankingList from '../../Components/MarketRankingList/MarketRankingList';
import { marketService } from '../../Services/marketService';

export default function Home() {

  return (
    <div className="space-y-4">
      
      {/* 1. BARRA SUPERIOR Y ESTADO (Indicadores Globales) */}
      <GlobalIndicators />

      {/* 2. CONTENIDO PRINCIPAL: Grid de 4 columnas (Proporción 1 - 2 - 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
        
        {/* COLUMNA IZQUIERDA: Panel de Mercado y Rankings (Ocupa 1/4) */}
        <div className="flex flex-col space-y-2 lg:col-span-1">
          {/* Tarjeta 1: Acciones/Emisoras */}
        <MarketRankingList 
          title="Top de Emisoras"
          subtitle="Mercado Local/Global"
          titleHref="/emisoras"
          fetchData={marketService.getTopIssuers}
        />

        {/* Tarjeta 2: Divisas / Forex */}
        <MarketRankingList 
          title="Mercado de Divisas"
          subtitle="Forex Real-Time"
          titleHref="/forex"
          fetchData={marketService.getForex}
        />

        {/* Tarjeta 3: Materias Primas / Commodities */}
        <MarketRankingList 
          title="Commodites"
          subtitle="Energía y Metales"
          titleHref="/commodities"
          fetchData={marketService.getCommodities}
        />
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