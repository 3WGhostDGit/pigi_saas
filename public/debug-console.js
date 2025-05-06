/**
 * Debug Console Utility
 * 
 * This script adds debugging utilities to the browser console.
 * Include it in your HTML with:
 * <script src="/debug-console.js"></script>
 */

(function() {
  // Only run in development
  if (window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    return;
  }
  
  // Create the debug namespace
  window.debug = window.debug || {};
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  };
  
  // Enable or disable debug mode
  let debugMode = localStorage.getItem('debugMode') === 'true';
  
  // Toggle debug mode
  window.debug.toggle = function() {
    debugMode = !debugMode;
    localStorage.setItem('debugMode', debugMode);
    console.log(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`);
    return debugMode;
  };
  
  // Check if debug mode is enabled
  window.debug.isEnabled = function() {
    return debugMode;
  };
  
  // Enhanced logging with timestamps and labels
  window.debug.log = function(label, data) {
    if (!debugMode) return;
    
    const timestamp = new Date().toISOString();
    const styles = 'color: #4CAF50; font-weight: bold;';
    
    originalConsole.log(
      `%c[DEBUG ${timestamp}] ${label}:`, 
      styles, 
      data
    );
  };
  
  // Inspect an object's properties
  window.debug.inspect = function(obj) {
    if (!debugMode) return;
    
    if (!obj) {
      originalConsole.log('Object is null or undefined');
      return;
    }
    
    const props = Object.getOwnPropertyNames(obj).sort();
    const protoProps = [];
    
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== Object.prototype) {
      protoProps.push(...Object.getOwnPropertyNames(proto));
      proto = Object.getPrototypeOf(proto);
    }
    
    originalConsole.group('Object Inspection');
    originalConsole.log('Type:', typeof obj);
    originalConsole.log('Constructor:', obj.constructor?.name || 'Unknown');
    
    originalConsole.group('Own Properties');
    props.forEach(prop => {
      try {
        originalConsole.log(`${prop}:`, obj[prop]);
      } catch (e) {
        originalConsole.log(`${prop}: [Error accessing property]`);
      }
    });
    originalConsole.groupEnd();
    
    originalConsole.group('Prototype Properties');
    [...new Set(protoProps)].sort().forEach(prop => {
      if (!props.includes(prop)) {
        try {
          originalConsole.log(`${prop}:`, obj[prop]);
        } catch (e) {
          originalConsole.log(`${prop}: [Error accessing property]`);
        }
      }
    });
    originalConsole.groupEnd();
    
    originalConsole.groupEnd();
  };
  
  // Measure execution time
  window.debug.time = async function(fn, ...args) {
    if (!debugMode) return fn(...args);
    
    const label = fn.name || 'Anonymous Function';
    console.time(label);
    
    try {
      const result = await fn(...args);
      console.timeEnd(label);
      return result;
    } catch (error) {
      console.timeEnd(label);
      throw error;
    }
  };
  
  // Monitor network requests
  window.debug.monitorNetwork = function(enable = true) {
    if (!debugMode) return;
    
    if (window._debugNetworkMonitor) {
      window.removeEventListener('fetch', window._debugNetworkMonitor);
      delete window._debugNetworkMonitor;
      originalConsole.log('Network monitoring disabled');
      return;
    }
    
    if (enable) {
      const originalFetch = window.fetch;
      
      window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        const method = init?.method || 'GET';
        
        originalConsole.log(`%c[Network] ${method} ${url}`, 'color: #2196F3;', init);
        
        try {
          const response = await originalFetch(input, init);
          const clonedResponse = response.clone();
          
          try {
            const data = await clonedResponse.json();
            originalConsole.log(`%c[Network] Response for ${method} ${url}:`, 'color: #4CAF50;', data);
          } catch (e) {
            originalConsole.log(`%c[Network] Response for ${method} ${url} (not JSON):`, 'color: #4CAF50;', await response.clone().text());
          }
          
          return response;
        } catch (error) {
          originalConsole.error(`%c[Network] Error for ${method} ${url}:`, 'color: #F44336;', error);
          throw error;
        }
      };
      
      window._debugNetworkMonitor = true;
      originalConsole.log('Network monitoring enabled');
    }
  };
  
  // Print welcome message
  if (debugMode) {
    console.log(
      '%c🐞 Debug Console Enabled 🐞\n' +
      'Available commands:\n' +
      '- debug.toggle() - Toggle debug mode\n' +
      '- debug.log(label, data) - Log with label\n' +
      '- debug.inspect(obj) - Inspect object properties\n' +
      '- debug.time(fn, ...args) - Measure execution time\n' +
      '- debug.monitorNetwork() - Monitor fetch requests',
      'color: #4CAF50; font-weight: bold; font-size: 12px;'
    );
  }
})();
