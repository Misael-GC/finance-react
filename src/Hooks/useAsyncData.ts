// src/hooks/useAsyncData.ts
import { useState, useEffect, useCallback } from 'react';

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void; // Por si quieres un botón de "reintentar" o actualizar en el componente
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (isMounted: { current: boolean }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      
      if (isMounted.current) {
        setData(result);
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || 'Ocurrió un error al cargar los datos.');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, dependencies); // Se recrea solo si las dependencias del componente cambian

  useEffect(() => {
    const isMounted = { current: true };
    
    execute(isMounted);

    return () => {
      isMounted.current = false;
    };
  }, [execute]);

  return { data, loading, error, refresh: () => execute({ current: true }) };
}