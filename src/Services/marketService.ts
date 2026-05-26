const BASE_URL = 'https://api.databursatil.com/v2';

// interfaces del Dominio Financiero (SOLID: Contratos de Tipado Claros)
export interface IndexItem {
  ticker: string;
  u: number; // Último precio
  c: number; // Cambio porcentual
}

export interface MarketAssetItem {
  ticker: string;
  percentageChange: number; // Porcentaje de cambio mapeado de forma limpia
  price?: number;           // Precio actual
}

/**
 * Función helper de mapeo utilitario independiente.
 * Extraída fuera del objeto para respetar SRP (Responsabilidad Única) 
 * y evitar errores de contexto con 'this' en callbacks asíncronos.
 */
function mapKeyValueResponse(data: any): MarketAssetItem[] {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [];
  }

  return Object.keys(data)
    .filter((key) => key !== 't') // Filtramos e ignoramos la propiedad de tiempo raíz "t"
    .map((key) => {
      const item = data[key];
      
      // Estrategia de Fallback: 
      // Si tiene 'c' lo toma (divisas); si no, busca 'p' (commodities); por último por defecto 0.
      const change = item.c !== undefined ? item.c : (item.p !== undefined ? item.p : 0);

      return {
        ticker: key.toUpperCase(), // Forzamos mayúsculas para homologar la presentación visual
        price: Number(item.u || 0),
        percentageChange: Number(change),
      };
    });
}

/**
 * Servicio encargado de la comunicación asíncrona con la API de DataBursatil.
 */
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

      // Validamos si la respuesta es el objeto Key-Value que devuelve la API
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const mappedArray = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            ticker: key,
            u: Number(item.u),
            c: Number(item.c),
          };
        });

        return mappedArray;
      }

      if (Array.isArray(data)) {
        return data as IndexItem[];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch global indicators:', error);
      throw error;
    }
  },

  async getTopIssuers(token: string): Promise<MarketAssetItem[]> {
    if (!token) throw new Error('API token is required');
    
    try {
      const response = await fetch(
        `${BASE_URL}/top?token=${token}&variables=suben,bajan&bolsa=BMV&cantidad=5&mercado=local`
      );
      if (!response.ok) throw new Error(`Error top issuers: ${response.statusText}`);
      
      const data = await response.json();
      if (data && typeof data === 'object') {
        const key = Object.keys(data).find(
          (k) => k.toLowerCase() === 'suben' || k.toLowerCase() === 'bajan' || Array.isArray(data[k])
        );
        const rawList = key ? data[key] : [];
        if (Array.isArray(rawList)) {
          return rawList.map((item: any) => ({
            ticker: String(item.e || 'UNKNOWN'),
            price: Number(item.u || 0),
            percentageChange: Number(item.c || 0),
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch top issuers:', error);
      throw error;
    }
  },

  async getForex(token: string): Promise<MarketAssetItem[]> {
    if (!token) throw new Error('API token is required');
    
    try {
      const response = await fetch(`${BASE_URL}/divisas?token=${token}`);
      if (!response.ok) throw new Error(`Error forex: ${response.statusText}`);
      
      const data = await response.json();
      return mapKeyValueResponse(data);
    } catch (error) {
      console.error('Failed to fetch forex:', error);
      throw error;
    }
  },

  async getCommodities(token: string): Promise<MarketAssetItem[]> {
    if (!token) throw new Error('API token is required');
    
    try {
      const response = await fetch(`${BASE_URL}/commodities?token=${token}`);
      if (!response.ok) throw new Error(`Error commodities: ${response.statusText}`);
      
      const data = await response.json();
      return mapKeyValueResponse(data);
    } catch (error) {
      console.error('Failed to fetch commodities:', error);
      throw error;
    }
  }
};