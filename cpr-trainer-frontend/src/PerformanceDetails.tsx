import React, { useEffect, useState } from 'react';
import { X, Clock, Activity, ArrowDownCircle, ArrowUpCircle, Award, BarChart2, Heart, LineChart as LineChartIcon } from 'lucide-react';
import Performance from './types/Performance'; // Import your existing Performance type
import { JSX } from 'react/jsx-runtime';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import './CPRPerformanceDetailPopup.css';
import PerformanceNote from './types/PerformanceNote';

type FeedbackType = 'excellent' | 'good' | 'needs-improvement' | 'all';

// Additional metrics not included in the Performance type
/*interface DetailedMetrics {
  fullReleasePercentage: number;
  detailedNotes: string;
  // Per-compression data
  depthData: Array<{ compression: number; depth: number }>;
  frequencyData: Array<{ compression: number; rate: number }>;
}*/

interface CPRPerformanceDetailPopupProps {
  performance: Performance;
  depthData: Array<{ compression: number; depth: number }>;
  freqData: Array<{ compression: number; frequency: number }>;
  onClose: () => void;
}

function CPRPerformanceDetailPopup({ performance, depthData, freqData, onClose }: CPRPerformanceDetailPopupProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<'metrics' | 'notes' | 'statistics'>('metrics');
  const [performanceNotes, setPerformanceNotes] = useState<PerformanceNote[]>([]);
  
  console.log("freq:"+freqData);
  // Mock data for metrics not in the original performance object
  // Generate sample time-series data for depth and frequency
 // Generate sample per-compression data based on the performance metrics
 /*const generateCompressionData = () => {
  const depthData = [];
  const frequencyData = [];
  
  // Use totalCompression count to generate data for each compression
  for (let i = 1; i <= performance.totalCompression; i++) {
    // Create variations in depth with occasional outliers
    let depthValue = performance.meanDepth;
    
    // Add some randomness and patterns to simulate real data
    if (i % 20 < 10) {
      // Gradually decrease depth to simulate fatigue
      depthValue -= (i % 10) * (performance.stdDepth / 5);
    } else {
      // Recovery period with improved depth
      depthValue += (performance.stdDepth / 3);
    }
    
    // Add random variation
    depthValue += ((Math.random() * 2) - 1) * performance.stdDepth;
    
    // Add occasional outliers
    if (i % 25 === 0) depthValue += performance.stdDepth * 2; // Too deep
    if (i % 30 === 0) depthValue -= performance.stdDepth * 2; // Too shallow
    
    depthData.push({
      compression: i,
      depth: Math.max(0, depthValue)
    });
    
    // Similar pattern for frequency/rate data
    let rateValue = performance.meanFreq;
    
    // Add some pattern to the data
    if (i % 15 < 7) {
      // Gradually increase rate
      rateValue += (i % 7) * (performance.stdFreq / 4);
    } else {
      // Gradual decrease
      rateValue -= (performance.stdFreq / 2);
    }
    
    // Add random variation
    rateValue += ((Math.random() * 2) - 1) * performance.stdFreq;
    
    // Add occasional outliers
    if (i % 22 === 0) rateValue += performance.stdFreq * 2; // Too fast
    if (i % 28 === 0) rateValue -= performance.stdFreq * 2; // Too slow
    
    frequencyData.push({
      compression: i,
      rate: Math.max(0, rateValue)
    });
  }
  
  return { depthData, frequencyData };
};

const compressionData = generateCompressionData();

const detailedMetrics: DetailedMetrics = {
  fullReleasePercentage: 92,
  detailedNotes: "Overall performance shows good technique with consistent depth. Some improvements needed in maintaining proper rhythm throughout the session. Compression depth was occasionally too shallow in the middle of the session, possibly indicating fatigue. Hand positioning was excellent throughout the training.",
  depthData: compressionData.depthData,
  frequencyData: compressionData.frequencyData
};*/


  useEffect(() => {
    async function getPerformanceNote(){
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      const performanceData = performance;
      const performanceNotesResponse = await fetch(`api/auth/getPerformanceNotes?param=${performanceData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token ? token.split('=')[1] : ''}`
        }
      });
      if (performanceNotesResponse.ok) {
        const performanceNotesData = await performanceNotesResponse.json();
        console.log("Performance notes data retrieved:", performanceNotesData);
        setPerformanceNotes(performanceNotesData);
      }
    }
    getPerformanceNote();
  }, []);




  // Helper function to determine the color of feedback badge
  const getFeedbackColor = (type: string): string => {
    switch (type) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTrainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (remainingSeconds === 60) {
      return `${minutes + 1}:00`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  

  const IDEAL_MIN_FREQ = 100;
  const IDEAL_MAX_FREQ = 120;
  const IDEAL_MIN_DEPTH = 50;
  const IDEAL_MAX_DEPTH = 60;

  return (
    <div className="popup-overlay">
     <div className="popup-content">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">CPR Performance Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Performance summary bar */}
        <div className="bg-blue-50 dark:bg-blue-900/30 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(performance.performanceDate)}</span>
          </div>
          
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration: {formatTrainingTime(performance.trainingTime)} min
            </span>
          </div>
          
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeedbackColor(performance.feedbackType)}`}>
              {performance.feedbackType === 'A' ? 'Audio' 
                : (performance.feedbackType === 'H' ? 'Haptic'
                : (performance.feedbackType === 'V' ? 'Visual' 
                : (performance.feedbackType === 'AH' ? 'Audio-Haptic'
                : (performance.feedbackType === 'VA' ? 'Visual-Audio'
                : (performance.feedbackType === 'VH' ? 'Visual-Haptic'
                : (performance.feedbackType === 'VAH' ? 'Visual-Audio-Haptic' : ""))))))}
            </span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
              activeTab === 'metrics'
                ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('metrics')}
          >
            Performance Metrics
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
              activeTab === 'statistics'
                ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('statistics')}
          >
            Statistics
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
              activeTab === 'notes'
                ? 'text-blue-600 border-b-2 border-blue-500 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Detailed Notes
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'metrics' ? (
            <div className="space-y-6">
              {/* Primary metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Compression Rate</span>
                      <span className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{performance.meanFreq} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">bpm</span></span>
                    </div>
                    <BarChart2 className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Compression Depth</span>
                      <span className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{performance.meanDepth} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">mm</span></span>
                    </div>
                    <ArrowDownCircle className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Total Compressions</span>
                      <span className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{performance.totalCompression}</span>
                    </div>
                    <Heart className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              {/* Detailed metrics */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detailed Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Compression Depth</h4>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <ArrowUpCircle className="h-5 w-5 text-red-500" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Too Deep</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{performance.highDepthCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <ArrowDownCircle className="h-5 w-5 text-yellow-500" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Too Shallow</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{performance.lowDepthCount}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Consistency (Std Dev)</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">±{performance.stdDepth.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Compression Rate</h4>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-red-500" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Too Fast</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{performance.highFreqCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Activity className="h-5 w-5 text-yellow-500" />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Too Slow</span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{performance.lowFreqCount}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Consistency (Std Dev)</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">±{performance.stdFreq.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-500" />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{performance.score}/100</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'statistics' ? (
            <div className="space-y-6">
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Performance Trends</h3>
              </div>
              
              
              {/* Depth Chart - Per Compression */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Compression Depth by Compression</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={depthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis 
                        dataKey="compression" 
                        stroke="#9CA3AF" 
                        label={{ value: 'Compression Number', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        label={{ value: 'Depth (mm)', angle: -90, position: 'insideLeft', offset: 10 }} 
                        domain={[Math.min(IDEAL_MIN_DEPTH - 10, Math.min(...(performance.depthArray.length ? performance.depthArray : [IDEAL_MIN_DEPTH - 10]))), Math.max(IDEAL_MAX_DEPTH + 10, Math.max(...(performance.depthArray.length ? performance.depthArray : [IDEAL_MAX_DEPTH + 10])))]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        formatter={(value:string, name:string) => [`${value} mm`, 'Depth']}
                        labelFormatter={(label:string) => `Compression #${label}`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <ReferenceArea
                        y1={IDEAL_MIN_DEPTH} 
                        y2={IDEAL_MAX_DEPTH} 
                        strokeOpacity={0} 
                        fill="green" 
                        fillOpacity={0.2}
                      />
                      <ReferenceLine 
                        y={IDEAL_MAX_DEPTH} 
                        stroke="#9CA3AF" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Upper Target', 
                          position: 'right', 
                          style: { fill: '#9CA3AF', fontSize: 10 } 
                        }} 
                      />
                      <ReferenceLine 
                        y={IDEAL_MIN_DEPTH} 
                        stroke="#9CA3AF" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Lower Target', 
                          position: 'right', 
                          style: { fill: '#9CA3AF', fontSize: 10 } 
                        }} 
                      />
                      {/* Target depth zone */}
                      
                      <Line 
                        type="monotone" 
                        dataKey="depth" 
                        name="Depth" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#93C5FD' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                    <span>Compression Depth</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-1 bg-gray-400 rounded-full mr-1"></span>
                    <span>Target Range {(IDEAL_MIN_DEPTH)}-{(IDEAL_MAX_DEPTH)} mm</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-1 bg-gray-400 stroke-dasharray-2 mr-1"></span>
                    <span>Mean Depth ({performance.meanDepth.toFixed(1)} mm)</span>
                  </div>
                </div>
              </div>
              
              {/* Frequency Chart - Per Compression */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Compression Rate by Compression</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={freqData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis 
                        dataKey="compression" 
                        stroke="#9CA3AF" 
                        label={{ value: 'Compression Number', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        label={{ value: 'Rate (bpm)', angle: -90, position: 'insideLeft', offset: 10 }} 
                        domain={[Math.min(IDEAL_MIN_FREQ - 10, Math.min(...(performance.freqArray.length ? performance.freqArray : [IDEAL_MIN_FREQ - 10]))), Math.max(IDEAL_MAX_FREQ + 10, Math.max(...(performance.freqArray.length ? performance.freqArray : [IDEAL_MAX_FREQ + 10])))]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        formatter={(value:string, name:string) => [`${value} bpm`, 'Rate']}
                        labelFormatter={(label:string) => `Compression #${label}`}
                      />
                      <Legend verticalAlign="top" height={36} />
                      
                      {/* Target rate zone */}
                      <ReferenceArea 
                        y1={IDEAL_MIN_FREQ} 
                        y2={IDEAL_MAX_FREQ} 
                        strokeOpacity={0} 
                        fill="green" 
                        fillOpacity={0.2}
                      />
                      <ReferenceLine 
                        y={IDEAL_MAX_FREQ} 
                        stroke="#9CA3AF" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Upper Target', 
                          position: 'right', 
                          style: { fill: '#9CA3AF', fontSize: 10 } 
                        }} 
                      />
                      <ReferenceLine 
                        y={IDEAL_MIN_FREQ} 
                        stroke="#9CA3AF" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Lower Target', 
                          position: 'right', 
                          style: { fill: '#9CA3AF', fontSize: 10 } 
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="frequency" 
                        name="Rate" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#6EE7B7' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                    <span>Actual Rate</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-1 bg-gray-400 rounded-full mr-1"></span>
                    <span>Ideal Range {IDEAL_MIN_FREQ} - {IDEAL_MAX_FREQ} bpm</span>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-1 bg-gray-400 stroke-dasharray-2 mr-1"></span>
                    <span>Mean Depth ({performance.meanFreq.toFixed(1)} bpm)</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Compression in Target Depth Range</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Math.round(100 - ((performance.highDepthCount + performance.lowDepthCount) / performance.totalCompression * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.round(100 - ((performance.highDepthCount + performance.lowDepthCount) / performance.totalCompression * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Compression in Target Rate Range</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {Math.round(100 - ((performance.highFreqCount + performance.lowFreqCount) / performance.totalCompression * 100))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.round(100 - ((performance.highFreqCount + performance.lowFreqCount) / performance.totalCompression * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Instructor Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {"fdjvn"}
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  {
                    performanceNotes.map((message, sentiment) => (
                      <li key={message.message} className="flex items-start">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${getFeedbackColor(message.sentiment)} mr-2`}>
                          {message.sentiment === 'positive' ? '✓' : (message.sentiment === 'negative' ? '!' : 'X')}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{message.message}</span>
                      </li>
                    ))
                  }
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">Excellent hand positioning throughout</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">Good overall compression rate consistency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">!</span>
                    <span className="text-gray-700 dark:text-gray-300">Work on maintaining depth during extended sessions</span>
                  </li>

                  {performance.highDepthCount > 5 && (
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">!</span>
                      <span className="text-gray-700 dark:text-gray-300">Avoid excessive compression depth ({performance.highDepthCount} instances)</span>
                    </li>
                  )}

                  {performance.lowFreqCount > 5 && (
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">!</span>
                      <span className="text-gray-700 dark:text-gray-300">Increase compression rate to meet guidelines ({performance.lowFreqCount} slow instances)</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CPRPerformanceDetailPopup;