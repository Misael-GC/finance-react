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

export interface HistoricalChartItem {
  date: string;  // Fecha formateada (ej: "03 Nov")
  price: number; // Precio al cierre del día
}

export interface CompanyProfileItem {
  ticker: string;
  corporateName: string;      // Razón social mapeada
  marketSector: string;       // Descripción del tipo de valor o sector
  isin?: string;
  exchange?: string;          // Bolsa de origen
  status?: string;            // Estatus actual
  sharesInCirculation?: number; // Acciones en circulación
}

export interface TradeItem {
  id: string;   // ID del hecho o combinación única
  time: string; // Hora en formato HH:MM:SS (mapeado de 'h')
  price: number; // Último hecho (mapeado de 'u')
  volume: number; // Volumen (mapeado de 'v')
  buyer: string;  // Casa compra (mapeado de 'cc')
  seller: string; // Casa vende (mapeado de 'cv')
}

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
      // 1. Corregir el desfase de zona horaria (Evita que salte al día de mañana por la tarde/noche)
      const tzOffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzOffset)).toISOString();
      const today = localISOTime.split('T')[0]; // "YYYY-MM-DD" local exacto

      const targetTicker = encodeURIComponent(ticker);
      
      const response = await fetch(
        `${BASE_URL}/intradia?token=${token}&intervalo=1m&inicio=${today}&final=${today}&emisora_serie=${targetTicker}&bolsa=BMV`
      );
      
      if (!response.ok) throw new Error(`Error intraday fetch: ${response.statusText}`);
      
      const data = await response.json();

      // Buscamos dinámicamente el contenido del ticker (ya sea data["WALMEX*"] o el primer objeto que venga)
      const rawContent = data[ticker] || Object.values(data)[0];

      // Verificamos si es un objeto Key-Value de marcas de tiempo
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
  },

  async getHistoricalData(token: string, ticker: string): Promise<HistoricalChartItem[]> {
    if (!token) throw new Error('API token is required');

    try {
      // Calculamos dinámicamente un rango de fechas de los últimos 30 días
      const todayObj = new Date();
      const thirtyDaysAgoObj = new Date();
      thirtyDaysAgoObj.setDate(todayObj.getDate() - 30);

      const finalDate = todayObj.toISOString().split('T')[0];
      const startDate = thirtyDaysAgoObj.toISOString().split('T')[0];

      const targetTicker = encodeURIComponent(ticker);

      const response = await fetch(
        `${BASE_URL}/historicos?token=${token}&inicio=${startDate}&final=${finalDate}&emisora_serie=${targetTicker}`
      );

      if (!response.ok) throw new Error(`Error historical fetch: ${response.statusText}`);

      const data = await response.json();

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Recorremos las llaves del objeto (que representan las fechas)
        const mappedData = Object.keys(data).map((dateStr) => {
          const values = data[dateStr]; // Devuelve [precio, volumen]
          
          // Formateamos sutilmente la fecha de "2025-11-03" a "03 Nov" para que luzca limpio en el eje X
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          const parts = dateStr.split('-');
          const label = parts.length === 3 ? `${parts[2]} ${months[parseInt(parts[1]) - 1]}` : dateStr;

          return {
            date: label,
            price: Array.isArray(values) ? Number(values[0] || 0) : 0
          };
        });

        // Ordenamos cronológicamente de pasado a presente
        return mappedData;
      }

      return [];
    } catch (error) {
      console.error(`Failed to fetch historical data for ${ticker}:`, error);
      throw error;
    }
  },

  async getCompanyProfile(token: string, ticker: string): Promise<CompanyProfileItem | null> {
    if (!token) throw new Error('API token is required');

    try {
      // Limpiamos el asterisco de búsqueda si existiera para el query de coincidencia
      const searchLetter = ticker.replace('*', '');
      
      const response = await fetch(
        `${BASE_URL}/emisoras?token=${token}&letra=${searchLetter}&mercado=local`
      );

      if (!response.ok) throw new Error(`Error fetching company profile: ${response.statusText}`);

      const data = await response.json();

      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Buscamos dinámicamente la clave que coincida con el ticker solicitado
        const matchedKey = Object.keys(data).find(
          (key) => key.toUpperCase().replace('*', '') === searchLetter.toUpperCase()
        );

        const targetData = matchedKey ? data[matchedKey] : null;

        // Si la estructura viene anidada por series (ej: data["WALMEX"]["*"]) extraemos el primer registro del objeto interno
        if (targetData && typeof targetData === 'object' && !Array.isArray(targetData)) {
          const firstSeriesKey = Object.keys(targetData)[0];
          const profile = targetData[firstSeriesKey];

          if (profile) {
            return {
              ticker: matchedKey || ticker,
              corporateName: String(profile.razon_social || 'No disponible'),
              marketSector: String(profile.tipo_valor_descripcion || 'Capitales - Serie de Acciones'),
              isin: String(profile.isin || ''),
              exchange: String(profile.bolsa || 'BMV'),
              status: String(profile.estatus || 'Activa'),
              sharesInCirculation: Number(profile.acciones_en_circulacion || 0)
            };
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Failed to fetch company profile for ${ticker}:`, error);
      throw error;
    }
  },

  async getMarketTrades(token: string, emisoraSerie: string): Promise<TradeItem[]> {
  if (!token) throw new Error('API token is required');

  try {
    // 1. Obtener la fecha local correcta (Evita el desfase de ISOString/UTC)
    const tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset en ms
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString();
    const fechaLocal = localISOTime.split('T')[0]; // "YYYY-MM-DD"

    // 2. Obtener la hora actual para el tope final del filtro (Formato HH:MM)
    const ahora = new Date();
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    // 3. Definir hora de inicio (ej: 08:00 que abre el mercado para capturar todo el día)
    const horaInicio = '08:00'; 

    const targetTicker = encodeURIComponent(emisoraSerie);
    
    // Construimos la URL con fecha real local y rango dinámico de tiempo
    const url = `${BASE_URL}/hechos?token=${token}&emisora_serie=${targetTicker}&fecha=${fechaLocal}&horai=${horaInicio}&horaf=${horaActual}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error fetching trades: ${response.statusText}`);

    const data = await response.json();

    if (data && typeof data === 'object') {
      const rawTrades = data[emisoraSerie] || Object.values(data)[0] || data;

      if (Array.isArray(rawTrades)) {
        const mappedTrades = rawTrades.map((item: any, idx: number) => ({
          id: item.id || `trade-${idx}-${item.h}`,
          time: String(item.h || '00:00:00'),
          price: Number(item.u || 0),
          volume: Number(item.v || 0),
          buyer: String(item.cc || '-'),
          seller: String(item.cv || '-')
        }));

        // 4. IMPORTANTE: Ordenar al revés (más recientes primero) 
        // para que tu .slice(0, 5) en el componente muestre las ÚLTIMAS operaciones del mercado.
        return mappedTrades.sort((a, b) => b.time.localeCompare(a.time));
      }
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch trades for ${emisoraSerie}:`, error);
    throw error;
  }
}

};