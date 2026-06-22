import React, { useState, useEffect } from 'react';
import { herramientasService } from '../../Services/herramientasService';
import { type HerramientaFinanciera } from '../../Types/HerramientaFinanciera';

export const HerramientasFinancieras: React.FC = () => {
  const [herramientas, setHerramientas] = useState<HerramientaFinanciera[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    const cargarHerramientas = async () => {
      try {
        setLoading(true);
        const data = await herramientasService.obtenerHerramientas();
        setHerramientas(data);
      } catch (err) {
        setError('No se pudieron cargar las herramientas del mercado. Verifica la conexión.' + (err instanceof Error ? ` Detalles: ${err.message}` : ''));
      } finally {
        setLoading(false);
      }
    };

    cargarHerramientas();
  }, []);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await herramientasService.descargarPDF();
    } catch (error) {
      alert("No se pudo descargar el reporte en este momento." + (error instanceof Error ? ` Detalles: ${error.message}` : ''));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
            Herramientas de Mercado
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Explora los instrumentos financieros y genera reportes.
          </p>
        </div>
        
        {/* Botón para solicitar el PDF al Backend */}
        <button 
          onClick={handleDownloadPDF}
          disabled={downloading || loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {downloading ? (
            <span>Generando PDF...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar Reporte
            </>
          )}
        </button>
      </div>

      {/* Manejo de estados de carga y error (UX limpia) */}
      {loading && (
        <div className="animate-pulse flex space-x-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
          {error}
        </div>
      )}

      {/* Renderizado del Grid (Performance visual) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {herramientas.map((herramienta, index) => (
            <div 
              key={index} 
              className="p-5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                {herramienta.name}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm">
                {herramienta.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};