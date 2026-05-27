
import Card from '../../Components/Card/Card';
import GlobalIndicators from '../../Components/GlobalIndicators/GlobalIndicators';
import MarketRankingList from '../../Components/MarketRankingList/MarketRankingList';
import IntradayChart from '../../Components/IntradayChart/IntradayChart';
import HistoricalChart from '../../Components/HistoricalChart/HistoricalChart';
import CompanyProfile from '../../Components/CompanyProfile/CompanyProfile';
import MarketTrades from '../../Components/MarketTrades/MarketTrades';
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
            <IntradayChart />
          </div>



          <div className="min-h-[18.6rem] flex flex-col">
            <HistoricalChart />
          </div>
        </div>

        {/* COLUMNA DERECHA: Detalle de Emisora y Datos (Ocupa 1/4) */}
        <div className="flex flex-col space-y-2 lg:col-span-1">
          <CompanyProfile />

          <Card title="Análisis Fundamental" subtitle="/v2/financieros">
            <div className="mt-2 text-xs space-y-2 text-cyan-400 cursor-pointer">
              <p className="hover:text-cyan-300">Estados de Situación Financiera →</p>
              <p className="hover:text-cyan-300">Flujos de Efectivo →</p>
              <p className="hover:text-cyan-300">Resultados Trimestrales →</p>
            </div>
          </Card>

          <MarketTrades />
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