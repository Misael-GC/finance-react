// src/Components/CompanyProfile/CompanyProfile.tsx
import { useUI } from '../../Context/UIContext';
import { marketService } from '../../Services/marketService';
import { useAsyncData } from '../../Hooks/useAsyncData';
import Card from '../Card/Card';

export default function CompanyProfile() {
  const { apiToken } = useUI();

  // Abstraemos la consulta asíncrona mediante el Hook Genérico
  const { data: profile, loading, error } = useAsyncData(async () => {
    if (!apiToken) return null;
    return await marketService.getCompanyProfile(apiToken, 'WALMEX*');
  }, [apiToken]);

  return (
    <Card title="Perfil de la Empresa" subtitle="/v2/emisoras" titleHref="/emisoras">
      {loading ? (
        /* ================= SKELETON LOADER (MISMOS COLORES) ================= */
        <div className="mt-2 text-xs space-y-2.5 animate-pulse">
          {/* Fila Ticker (Emisora) */}
          <div>
            <div className="h-3.5 bg-slate-700 rounded w-16 mb-1.5" />
            <div className="h-6 bg-slate-700/50 rounded w-20 border border-slate-700/20" />
          </div>
          {/* Fila Razón Social */}
          <div>
            <div className="h-3.5 bg-slate-700 rounded w-24 mb-1.5" />
            <div className="h-4 bg-slate-700 rounded w-full" />
          </div>
          {/* Fila Clasificación */}
          <div>
            <div className="h-3.5 bg-slate-700 rounded w-40 mb-1.5" />
            <div className="h-4 bg-slate-700 rounded w-3/4" />
          </div>
          {/* Fila Código ISIN */}
          <div>
            <div className="h-3.5 bg-slate-700 rounded w-20 mb-1.5" />
            <div className="h-4 bg-slate-700 rounded w-1/2" />
          </div>
        </div>
      ) : error ? (
        /* ====== ESTADO DE ERROR FINANCIERO ESTILIZADO ====== */
        <div className="mt-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-md flex items-center space-x-2">
          <span className="text-rose-400 text-xs font-medium">⚠️ {error}</span>
        </div>
      ) : !profile ? (
        /* ====== ESTADO VACÍO ====== */
        <p className="text-slate-500 text-xs mt-2 italic">No se encontraron datos del perfil</p>
      ) : (
        /* ====== RENDERIZADO DE DATOS REALES ====== */
        <div className="mt-2 text-xs space-y-2.5">
          <p>
            <strong className="text-white block mb-0.5">Emisora:</strong> 
            <span className="text-cyan-400 font-mono font-bold bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">
              {profile.ticker}
            </span>
          </p>
          <p>
            <strong className="text-white block mb-0.5">Razón Social:</strong> 
            <span className="text-slate-300 leading-relaxed block">{profile.corporateName}</span>
          </p>
          <p>
            <strong className="text-white block mb-0.5">Clasificación / Instrumento:</strong> 
            <span className="text-slate-400 block">{profile.marketSector}</span>
          </p>
          <p>
            <strong className="text-white block mb-0.5">Código ISIN:</strong> 
            <span className="text-slate-500 font-mono block">{profile.isin}</span>
          </p>
        </div>
      )}
    </Card>
  );
}