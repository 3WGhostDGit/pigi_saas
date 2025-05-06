'use client';

import { useState } from 'react';
import { inspectObject } from '@/lib/debug';

interface DebugPanelProps {
  data: any;
  title?: string;
  expanded?: boolean;
}

export default function DebugPanel({ 
  data, 
  title = 'Debug Data', 
  expanded = false 
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw' | 'properties'>('formatted');
  
  // Format data for display
  const formatData = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return `Error formatting data: ${error}`;
    }
  };
  
  // Get object properties
  const getProperties = (data: any): string[] => {
    if (data === null || data === undefined) {
      return ['Data is null or undefined'];
    }
    
    return inspectObject(data);
  };
  
  // Only render in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="my-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-950">
      <div 
        className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-sm">{title}</h3>
        <button className="text-xs bg-primary text-white px-2 py-1 rounded">
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-3">
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-3">
            <button
              className={`px-3 py-2 text-sm ${activeTab === 'formatted' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('formatted')}
            >
              Formatted
            </button>
            <button
              className={`px-3 py-2 text-sm ${activeTab === 'raw' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('raw')}
            >
              Raw
            </button>
            <button
              className={`px-3 py-2 text-sm ${activeTab === 'properties' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab('properties')}
            >
              Properties
            </button>
          </div>
          
          {activeTab === 'formatted' && (
            <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-96">
              {formatData(data)}
            </pre>
          )}
          
          {activeTab === 'raw' && (
            <div className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-96">
              <p>Type: {typeof data}</p>
              <p>Constructor: {data?.constructor?.name || 'Unknown'}</p>
              <p>Value: {String(data)}</p>
            </div>
          )}
          
          {activeTab === 'properties' && (
            <div className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-96">
              <ul className="list-disc pl-5">
                {getProperties(data).map((prop, index) => (
                  <li key={index}>{prop}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
