// src/Pages/BOM/BOM.tsx
import React, { useState, useEffect } from 'react';
import { TaxonomyTree, type TractoData } from './TaxonomyTree';

export default function BOM() {
  const [tractoData, setTractoData] = useState<TractoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulación de latencia de red para la petición al API de Django
    const fetchTaxonomia = async () => {
      try {
        setLoading(true);
        
        // Aquí irá tu fetch real:
        // const response = await fetch('/api/bom_material/tractos/1/taxonomia/');
        // const data = await response.json();
        
        // Estructura anidada generada por tu optimización SQL JSON_AGG
        const mockData: TractoData = {
          id: "1",
          nombre: "KENWORTH",
          tipos: [
            {
              id: "t1", 
              nombre: "KENWORTH T880", 
              versiones: [
                { 
                  id: "v1", 
                  nombre: "VERSIÓN 1: 2024 MY", 
                  clientes: [
                    { id: "c1", nombre: "PETERBILT S.A." },
                    { id: "c2", nombre: "NAVISTAR INC." }
                  ] 
                },
                { id: "v2", nombre: "VERSIÓN 2: 2025 MY", clientes: [] }
              ]
            },
            { 
              id: "t2", 
              nombre: "KENWORTH W900", 
              versiones: [] 
            },
            { 
              id: "t3", 
              nombre: "KENWORTH T1920", 
              versiones: [] 
            }
          ]
        };

        // Simulamos un retraso de red
        setTimeout(() => {
          setTractoData(mockData);
          setLoading(false);
        }, 600);

      } catch (error) {
        console.error("Error al cargar la taxonomía:", error);
        setLoading(false);
      }
    };

    fetchTaxonomia();
  }, []);

  return (
    <div className="w-full flex flex-col gap-6 p-6">
      {/* Header de la vista */}
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-2xl font-bold text-slate-100">Lista de Materiales BOM PT</h1>
        <p className="text-slate-400 mt-2 text-sm max-w-3xl">
          Configura la taxonomía de los proyectos en 4 niveles conceptuales: Tractos / Proyectos, Tipos de Proyecto, Versión y Cliente. Selecciona un elemento para desplegar sus dependencias.
        </p>
      </div>

      {/* Contenedor principal del árbol */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-2 min-h-[60vh]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-cyan-400 font-medium animate-pulse">
            Obteniendo estructura de base de datos...
          </div>
        ) : (
          <TaxonomyTree tractoData={tractoData} />
        )}
      </div>

      {/* Panel Inferior (Para agregar detalles u otras configuraciones) */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mt-4">
         <h2 className="text-sm font-bold text-slate-300 uppercase mb-4">Tracto / Proyecto Activo</h2>
         <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors border border-slate-600">
              Sin tipos vinculados
            </button>
            <button className="px-4 py-2 bg-transparent border border-dashed border-slate-500 hover:border-cyan-400 hover:text-cyan-400 text-slate-400 rounded-lg text-sm transition-colors">
              + Nuevo tipo...
            </button>
         </div>
      </div>
    </div>
  );
}