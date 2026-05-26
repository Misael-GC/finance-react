const BASE_URL = 'https://api.databursatil.com/v2';

export interface IndexItem {
  ticker: string;
  u: number; // Último precio
  c: number; // Cambio porcentual
}

export const marketService = {
  async getGlobalIndicators(token: string): Promise<IndexItem[]> {
    if (!token) {
      throw new Error('API token is required to fetch global indicators');
    }

    try {
      const response = await fetch(`${BASE_URL}/indices?token=${token}`);

      if (!response.ok) {
        throw new Error(`Error fetching global indicators: ${response.statusText}`);
      }

      const data = await response.json();

      // Validamos si la respuesta es el objeto Key-Value que muestra tu consola
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        
        // Transformamos dinámicamente el Objeto en un Arreglo iterable
        const mappedArray = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            ticker: key,        // 'CAC40', 'DAX', 'SP500', etc.
            u: Number(item.u),  // Mapea el valor 'u' del objeto original
            c: Number(item.c),  // Mapea el cambio porcentual 'c'
          };
        });

        return mappedArray; // Esto ya devuelve el Array esperado de tipo IndexItem[]
      }

      // Fallback por si la estructura fuera un arreglo plano directo
      if (Array.isArray(data)) {
        return data as IndexItem[];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch global indicators:', error);
      throw error;
    }
  }
};