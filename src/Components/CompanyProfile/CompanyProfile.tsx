import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type CompanyProfileItem } from '../../Services/marketService';
import Card from '../Card/Card';

export default function CompanyProfile() {
  const { apiToken } = useUI();
  const [profile, setProfile] = useState<CompanyProfileItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!apiToken) return;

      try {
        setLoading(true);
        setError(null);
        
        // Consultamos dinámicamente los metadatos de WALMEX
        const data = await marketService.getCompanyProfile(apiToken, 'WALMEX*');
        
        if (isMounted) {
          setProfile(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError('Perfil no disponible');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  return (
    <Card title="Perfil de la Empresa" subtitle="/v2/emisoras" titleHref="/emisoras">
      {loading ? (
        <p className="text-slate-400 text-xs mt-2 animate-pulse">Consultando datos de pizarra...</p>
      ) : error ? (
        <p className="text-rose-400 text-xs mt-2">{error}</p>
      ) : !profile ? (
        <div className="mt-2 text-xs space-y-2">
          <p><strong className="text-white">Emisora:</strong> WALMEX</p>
          <p><strong className="text-white">Razón Social:</strong> Wal-Mart de México, S.A.B.</p>
          <p><strong className="text-white">Sector:</strong> Consumo Frecuente</p>
        </div>
      ) : (
        <div className="mt-2 text-xs space-y-2.5">
          <p>
            <strong className="text-white block mb-0.5">Emisora:</strong> 
            <span className="text-cyan-400 font-mono font-bold bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/40">{profile.ticker}</span>
          </p>
          <p>
            <strong className="text-white block mb-0.5">Razón Social:</strong> 
            <span className="text-slate-300 leading-relaxed block">{profile.corporateName}</span>
          </p>
          <p>
            <strong className="text-white block mb-0.5">Clasificación / Instrumento:</strong> 
            <span className="text-slate-400 block">{profile.marketSector}</span>
          </p>
          {profile.isin && (
            <p>
              <strong className="text-white block mb-0.5">Código ISIN:</strong> 
              <span className="text-slate-500 font-mono block">{profile.isin}</span>
            </p>
          )}
        </div>
      )}
    </Card>
  );
}