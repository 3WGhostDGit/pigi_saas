import { PrismaClient } from '@prisma/client';
import { debugLog } from './debug';

/**
 * Creates a Prisma client with debug logging
 * @returns A Prisma client with debug logging enabled
 */
export function createDebugPrismaClient(): PrismaClient {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  // Log queries
  prisma.$on('query', (e) => {
    debugLog('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
      timestamp: new Date().toISOString(),
    });
  });

  // Log errors
  prisma.$on('error', (e) => {
    debugLog('Prisma Error', {
      message: e.message,
      target: e.target,
      timestamp: new Date().toISOString(),
    });
  });

  // Log info
  prisma.$on('info', (e) => {
    debugLog('Prisma Info', {
      message: e.message,
      timestamp: new Date().toISOString(),
    });
  });

  // Log warnings
  prisma.$on('warn', (e) => {
    debugLog('Prisma Warning', {
      message: e.message,
      timestamp: new Date().toISOString(),
    });
  });

  return prisma;
}

/**
 * Wraps a Prisma query with debug logging
 * @param label A label for the query
 * @param queryFn The Prisma query function
 * @returns The result of the query
 */
export async function debugPrismaQuery<T>(
  label: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  debugLog(`${label} - Starting query`, {});
  
  try {
    const result = await queryFn();
    const end = performance.now();
    
    debugLog(`${label} - Query completed`, {
      result,
      duration: `${(end - start).toFixed(2)}ms`,
    });
    
    return result;
  } catch (error) {
    const end = performance.now();
    
    debugLog(`${label} - Query failed`, {
      error,
      duration: `${(end - start).toFixed(2)}ms`,
    });
    
    throw error;
  }
}

/**
 * Example usage:
 * 
 * // Create a debug Prisma client
 * const prisma = createDebugPrismaClient();
 * 
 * // Use the debug query wrapper
 * const users = await debugPrismaQuery('Get all users', () => 
 *   prisma.user.findMany({
 *     include: { posts: true }
 *   })
 * );
 */
