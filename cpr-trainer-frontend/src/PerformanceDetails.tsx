import React, { useState } from 'react';
import { X, Clock, Activity, ArrowDownCircle, ArrowUpCircle, Award, BarChart2, Heart } from 'lucide-react';
import Performance from './types/Performance'; // Import your existing Performance type
import { JSX } from 'react/jsx-runtime';

type FeedbackType = 'excellent' | 'good' | 'needs-improvement' | 'all';

// Additional metrics not included in the Performance type
interface DetailedMetrics {
  fullReleasePercentage: number;
  detailedNotes: string;
}

interface CPRPerformanceDetailPopup {
  performance: Performance;
  onClose: () => void;
}

function CPRPerformanceDetailPopup({ performance, onClose }: CPRPerformanceDetailPopup): JSX.Element {
  const [activeTab, setActiveTab] = useState<'metrics' | 'notes'>('metrics');

  // Mock data for metrics not in the original performance object
  const detailedMetrics: DetailedMetrics = {
    fullReleasePercentage: 92,
    detailedNotes: "Overall performance shows good technique with consistent depth. Some improvements needed in maintaining proper rhythm throughout the session. Compression depth was occasionally too shallow in the middle of the session, possibly indicating fatigue. Hand positioning was excellent throughout the training."
  };

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

  // Format training time from seconds to MM:SS format
  const formatTrainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden transition-all transform">
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
              Duration: {formatTrainingTime(performance.trainingTime)}
            </span>
          </div>
          
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeedbackColor(performance.feedbackType)}`}>
              {performance.feedbackType === 'needs-improvement' 
                ? 'Needs Improvement' 
                : performance.feedbackType.charAt(0).toUpperCase() + performance.feedbackType.slice(1)}
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
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Instructor Notes</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {detailedMetrics.detailedNotes}
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
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