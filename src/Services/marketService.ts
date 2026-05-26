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

export interface IntradayChartItem {
  time: string;  // Hora o etiqueta de tiempo (ej: "10:30")
  price: number; // Precio de cierre mapeado
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
  },

  async getIntradayData(token: string, ticker: string): Promise<IntradayChartItem[]> {
    if (!token) throw new Error('API token is required');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const targetTicker = encodeURIComponent(ticker);
      
      const response = await fetch(
        `${BASE_URL}/intradia?token=${token}&intervalo=1m&inicio=${today}&final=${today}&emisora_serie=${targetTicker}&bolsa=BMV`
      );
      
      if (!response.ok) throw new Error(`Error intraday fetch: ${response.statusText}`);
      
      const data = await response.json();
      //console.log("JSON crudo recibido de la API intradía:", data);

      // Buscamos dinámicamente el contenido del ticker (ya sea data["WALMEX*"] o el primer objeto que venga)
      const rawContent = data[ticker] || Object.values(data)[0];

      // Verificamos si es un objeto Key-Value de marcas de tiempo (como lo muestra tu consola)
      if (rawContent && typeof rawContent === 'object' && !Array.isArray(rawContent)) {
        
        // Transformamos el objeto de marcas de tiempo en un Arreglo ordenado
        const mappedData = Object.keys(rawContent).map((timestamp) => {
          // Extraemos la sección de la hora (ej: "2026-05-26 07:30:00" -> "07:30")
          const timeLabel = timestamp.includes(' ') 
            ? timestamp.split(' ')[1].substring(0, 5) 
            : timestamp.substring(0, 5);

          return {
            time: timeLabel,
            price: Number(rawContent[timestamp] || 0) // El valor de la propiedad es el precio directo
          };
        });

        // Ordenamos los elementos cronológicamente por hora para que el gráfico no se cruce
        return mappedData.sort((a, b) => a.time.localeCompare(b.time));
      }

      // Fallback secundario si en algún horario cambiara a arreglo plano
      if (Array.isArray(rawContent)) {
        return rawContent.map((item: any) => {
          const timeLabel = item.f ? item.f.split(' ')[1]?.substring(0, 5) || item.f : '00:00';
          return {
            time: timeLabel,
            price: Number(item.u || item.c || item.p || 0),
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error(`Failed to fetch intraday data for ${ticker}:`, error);
      throw error;
    }
  }
};