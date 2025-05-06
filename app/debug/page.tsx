'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DebugPanel from '@/components/debug/DebugPanel';
import { useDebugFetch } from '@/hooks/useDebugFetch';
import { debugLog, measureExecutionTime } from '@/lib/debug';

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState('/api/rh/employees');
  const [activeTab, setActiveTab] = useState('api');
  const [manualData, setManualData] = useState<any>(null);
  
  // Use our debug fetch hook
  const { 
    data: apiData, 
    error, 
    loading, 
    metadata, 
    refetch 
  } = useDebugFetch(apiUrl);
  
  // Example of using the measureExecutionTime utility
  const handleTestPerformance = async () => {
    try {
      const result = await measureExecutionTime(async () => {
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, message: 'Operation completed' };
      });
      
      setManualData(result);
      debugLog('Performance test result', result);
    } catch (error) {
      console.error('Performance test failed:', error);
    }
  };
  
  // Example of manually setting debug data
  const handleSetDebugData = () => {
    const testData = {
      string: 'Hello World',
      number: 42,
      boolean: true,
      array: [1, 2, 3, 4, 5],
      object: {
        name: 'Test Object',
        properties: {
          nested: 'This is a nested property',
          date: new Date().toISOString()
        }
      },
      function: function() { return 'This is a function'; },
      null: null,
      undefined: undefined
    };
    
    setManualData(testData);
    debugLog('Manual test data', testData);
  };
  
  // Log when component mounts
  useEffect(() => {
    debugLog('DebugPage mounted', { timestamp: new Date().toISOString() });
    
    // Add a breakpoint here when debugging
    // debugger;
    
    return () => {
      debugLog('DebugPage unmounted', { timestamp: new Date().toISOString() });
    };
  }, []);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Tools</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="api">API Debugging</TabsTrigger>
          <TabsTrigger value="manual">Manual Debugging</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Request Debugger</CardTitle>
              <CardDescription>
                Test API endpoints and inspect the responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="apiUrl">API URL</Label>
                  <Input
                    id="apiUrl"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="Enter API URL"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={refetch} disabled={loading}>
                    {loading ? 'Loading...' : 'Fetch Data'}
                  </Button>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-md">
                  <p className="font-medium">Error:</p>
                  <p>{error.message}</p>
                </div>
              )}
              
              <DebugPanel 
                data={apiData} 
                title="API Response Data" 
                expanded={true} 
              />
              
              <DebugPanel 
                data={metadata} 
                title="API Response Metadata" 
                expanded={false} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Debugging</CardTitle>
              <CardDescription>
                Test debug utilities with custom data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleSetDebugData}>
                  Generate Test Data
                </Button>
                <Button onClick={handleTestPerformance} variant="outline">
                  Test Performance
                </Button>
              </div>
              
              {manualData && (
                <DebugPanel 
                  data={manualData} 
                  title="Manual Debug Data" 
                  expanded={true} 
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Debugging Instructions</h2>
        <div className="space-y-2">
          <p>1. Open your browser's developer tools (F12 or Ctrl+Shift+I)</p>
          <p>2. Go to the Console tab to see debug logs</p>
          <p>3. Go to the Sources tab and set breakpoints in your code</p>
          <p>4. Use the Network tab to inspect API requests</p>
          <p>5. Add <code>debugger;</code> statements in your code to pause execution</p>
        </div>
      </div>
    </div>
  );
}
