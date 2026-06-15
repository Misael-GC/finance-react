// src/Services/documentoService.ts

const API_URL = 'http://127.0.0.1:8000/api/documentos/';

export interface DocumentoResponse {
  id: number;
  codigo: string;
  nombre: string;
  ruta_o_enlace: string;
  creado_por?: number;
  modificado_por?: number;
  created_at: string;
  updated_at: string;
}

export const documentoService = {
  /**
   * Envía un nuevo documento o enlace al backend de Django
   */
  crearDocumento: async (formData: FormData): Promise<DocumentoResponse> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // IMPORTANTE: No definir 'Content-Type' aquí. 
        // El navegador lo asignará automáticamente con el "boundary" correcto para FormData.
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return await response.json();
    } catch (error) {
      console.error("Error en documentoService.crearDocumento:", error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de documentos activos (No borrados por Soft Delete)
   */
  obtenerDocumentos: async (): Promise<DocumentoResponse[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener documentos');
    return await response.json();
  }
};