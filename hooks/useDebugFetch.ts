'use client';

import { useState, useEffect, useCallback } from 'react';
import { debugLog, debugResponse } from '@/lib/debug';

interface FetchOptions extends RequestInit {
  debugLabel?: string;
}

interface DebugFetchResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  metadata: {
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    url?: string;
    timing?: {
      start: number;
      end: number;
      duration: number;
    };
  } | null;
  refetch: () => Promise<void>;
}

/**
 * A hook for fetching data with built-in debugging
 * @param url The URL to fetch
 * @param options Fetch options and debug settings
 * @returns The fetch result with debugging metadata
 */
export function useDebugFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): DebugFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<DebugFetchResult<T>['metadata']>(null);

  const { debugLabel = 'API Call', ...fetchOptions } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const startTime = performance.now();
    debugLog(`${debugLabel} - Starting fetch`, { url, options: fetchOptions });
    
    try {
      const response = await fetch(url, fetchOptions);
      const endTime = performance.now();
      
      // Debug the response
      const debugInfo = await debugResponse(response);
      debugLog(`${debugLabel} - Response received`, debugInfo);
      
      // Update metadata
      setMetadata({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        timing: {
          start: startTime,
          end: endTime,
          duration: endTime - startTime
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      debugLog(`${debugLabel} - Parsed data`, result);
      
      setData(result);
    } catch (err) {
      const endTime = performance.now();
      const errorObj = err instanceof Error ? err : new Error(String(err));
      
      debugLog(`${debugLabel} - Error`, errorObj);
      
      setError(errorObj);
      setMetadata(prev => ({
        ...prev,
        timing: {
          start: startTime,
          end: endTime,
          duration: endTime - startTime
        }
      }));
    } finally {
      setLoading(false);
    }
  }, [url, fetchOptions, debugLabel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, metadata, refetch: fetchData };
}
