/**
 * Debug utility functions for inspecting data during development
 */

/**
 * Log data with a label for easier identification in the console
 * @param label A descriptive label for the data
 * @param data The data to log
 */
export function debugLog(label: string, data: any): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEBUG] ${label}:`, data);
    
    // Add a breakpoint here when debugging
    // debugger;
  }
}

/**
 * Inspect an object's properties and methods
 * @param obj The object to inspect
 * @returns An array of the object's properties and methods
 */
export function inspectObject(obj: any): string[] {
  if (!obj) return ['Object is null or undefined'];
  
  try {
    // Get all properties including non-enumerable ones
    const props = Object.getOwnPropertyNames(obj);
    
    // Get prototype properties
    let proto = Object.getPrototypeOf(obj);
    let protoProps: string[] = [];
    
    while (proto && proto !== Object.prototype) {
      protoProps = [...protoProps, ...Object.getOwnPropertyNames(proto)];
      proto = Object.getPrototypeOf(proto);
    }
    
    // Combine and filter out duplicates
    const allProps = [...new Set([...props, ...protoProps])];
    
    // Sort alphabetically
    return allProps.sort();
  } catch (error) {
    return [`Error inspecting object: ${error}`];
  }
}

/**
 * Create a detailed report of an API response
 * @param response The fetch API response object
 * @returns A promise that resolves to the response data and metadata
 */
export async function debugResponse(response: Response): Promise<any> {
  try {
    // Clone the response to avoid consuming it
    const clonedResponse = response.clone();
    
    // Get response metadata
    const metadata = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
      redirected: response.redirected,
      type: response.type,
    };
    
    // Try to parse as JSON
    let data;
    try {
      data = await clonedResponse.json();
    } catch (e) {
      // If not JSON, try to get text
      data = await response.clone().text();
    }
    
    return {
      metadata,
      data
    };
  } catch (error) {
    return {
      error: `Error debugging response: ${error}`,
      response: {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      }
    };
  }
}

/**
 * Measure the execution time of a function
 * @param fn The function to measure
 * @param args Arguments to pass to the function
 * @returns A promise that resolves to the function result and execution time
 */
export async function measureExecutionTime<T>(
  fn: (...args: any[]) => Promise<T> | T,
  ...args: any[]
): Promise<{ result: T; executionTime: number }> {
  const start = performance.now();
  
  try {
    const result = await fn(...args);
    const end = performance.now();
    
    return {
      result,
      executionTime: end - start
    };
  } catch (error) {
    const end = performance.now();
    throw {
      error,
      executionTime: end - start
    };
  }
}

/**
 * Create a proxy to monitor all property access and method calls on an object
 * @param obj The object to monitor
 * @param name A name for the object (for logging)
 * @returns A proxied version of the object
 */
export function createDebugProxy<T extends object>(obj: T, name: string = 'object'): T {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      console.log(`[DEBUG] Accessed ${name}.${String(prop)}`);
      
      // If the property is a function, wrap it to log calls
      if (typeof value === 'function') {
        return function(...args: any[]) {
          console.log(`[DEBUG] Called ${name}.${String(prop)}() with args:`, args);
          try {
            const result = value.apply(this === receiver ? target : this, args);
            console.log(`[DEBUG] ${name}.${String(prop)}() returned:`, result);
            return result;
          } catch (error) {
            console.error(`[DEBUG] ${name}.${String(prop)}() threw error:`, error);
            throw error;
          }
        };
      }
      
      return value;
    },
    set(target, prop, value, receiver) {
      console.log(`[DEBUG] Set ${name}.${String(prop)} =`, value);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}
