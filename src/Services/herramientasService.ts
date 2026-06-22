import { type HerramientaFinanciera}  from '../Types/HerramientaFinanciera';

// Usamos la variable de entorno para manejar la conexión WSL -> Windows que vimos antes
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const herramientasService = {
  obtenerHerramientas: async (): Promise<HerramientaFinanciera[]> => {
    try {
      const response = await fetch(`${API_URL}/api/tools/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener herramientas financieras:', error);
      throw error; 
    }
  },

  descargarPDF: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/tools/pdf/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) throw new Error('Fallo al generar el documento en el servidor.');

      // Extraer el archivo binario de la respuesta
      const blob = await response.blob();
      
      // Crear una URL temporal en la memoria del navegador
      const url = window.URL.createObjectURL(blob);
      
      // Crear un enlace invisible, forzar el clic y limpiar la memoria (Optimización RAM)
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Herramientas_MarketTrack.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error en la descarga:', error);
      throw error;
    }
  }

};