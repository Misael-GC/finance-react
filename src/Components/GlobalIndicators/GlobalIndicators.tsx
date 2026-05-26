import { useState, useEffect } from 'react';
import { useUI } from '../../Context/UIContext';
import { marketService, type IndexItem } from '../../Services/marketService';
import './Globalindicators.css';

export default function GlobalIndicators() {
  const { apiToken } = useUI(); // Obtenemos el token desde el Contexto global
  const [indices, setIndices] = useState<IndexItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchIndicators() {
      try {
        setLoading(true);
        setError(null);
        
        if (!apiToken) {
            console.warn("El token de la API aún no está disponible.");
            return; 
        }
        // Consumo del servicio desacoplado
        const data = await marketService.getGlobalIndicators(apiToken);
        
        if (isMounted) {
          setIndices(data);
        }
      } catch (err: any | unknown) {
        if (isMounted) {
          setError(err.message || 'Error al cargar los mercados.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (apiToken) {
      fetchIndicators();
    } else {
      setLoading(false);
      setError('Configuración incompleta: Falta el Token de la API.');
    }

    return () => {
      isMounted = false;
    };
  }, [apiToken]);

  if (loading) {
    return (
      <div className="carousel w-full pb-2">
        <p className="text-slate-400 text-sm animate-pulse">Conectando con DataBursatil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel w-full pb-2">
        <p className="text-rose-400 text-sm">⚠️ {error}  ¯\_(ツ)_/¯</p>
      </div>
    );
  }

  return (
    <div className="carousel w-full pb-2">
      <div className="carousel-track">
        
        {/* Renderizado de Elementos Originales */}
        {indices.map((ind, index) => (
          <div
            key={`orig-${ind.ticker}-${index}`}
            className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg groups"
          >
            <span className="text-sm font-bold text-white">{ind.ticker}:</span>
            <span className="text-sm text-slate-300">{ind.u}</span>
            <span className={`text-xs font-bold ${ind.c > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({ind.c > 0 ? '+' : ''}{ind.c}%) {ind.c > 0 ? '▲' : '▼'}
            </span>
          </div>
        ))}

        {/* Duplicado exacto para preservar el efecto visual de carrusel infinito */}
        {indices.map((ind, index) => (
          <div
            key={`dup-${ind.ticker}-${index}`}
            className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg groups"
          >
            <span className="text-sm font-bold text-white">{ind.ticker}:</span>
            <span className="text-sm text-slate-300">{ind.u}</span>
            <span className={`text-xs font-bold ${ind.c > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({ind.c > 0 ? '+' : ''}{ind.c}%) {ind.c > 0 ? '▲' : '▼'}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}