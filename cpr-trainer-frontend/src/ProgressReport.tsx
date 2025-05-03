import { useState, useEffect, JSX } from 'react';
import { X, BarChart2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceArea } from 'recharts';
import Performance from './types/Performance';

type scoreData = {
    id: number;
    date: string;
    score: number;
}

const IDEAL_MIN_SCORE = 90;
const IDEAL_MAX_SCORE = 100;

interface PerformanceScorePopupProps {
    performance: Array<Performance>;
    onClose: () => void;
  }

function PerformanceScorePopup({ performance, onClose }: PerformanceScorePopupProps): JSX.Element {
  const [timeFrame, setTimeFrame] = useState('last10');
  const [scoreData, setScoreData] = useState<scoreData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Simulating data fetch based on selected time frame
  useEffect(() => {
    setLoading(true);
  
    const fetchData = () => {
      setTimeout(() => {
        const formattedData: scoreData[] = performance.map(perf => ({
          id: perf.id,
          date: perf.performanceDate,
          score: perf.score,
        }));
  
        const filteredData =
          timeFrame.includes('last10')
            ? formattedData.slice(-10) : (timeFrame.includes('last20')
            ? formattedData.slice(-20) : formattedData);
  
        setScoreData(filteredData);
        setLoading(false);
      }, 500);
    };
  
    fetchData();
  }, [timeFrame]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const calculateImprovement = () => {
    if (scoreData.length < 2) return { value: 0, isPositive: true };
    
    const firstScore = scoreData[0].score;
    const lastScore = scoreData[scoreData.length - 1].score;
    const diff = lastScore - firstScore;
    
    return {
      value: (Math.abs(diff)).toFixed(1),
      isPositive: diff >= 0
    };
  };
  
  const improvement = calculateImprovement();
  
  const getAverageScore = () => {
    if (scoreData.length === 0) return 0;
    const sum = scoreData.reduce((total, item) => total + item.score, 0);
    return (sum / scoreData.length).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 flex justify-center items-start pt-24 z-50 overflow-y-auto">
     <div className="bg-white p-5 rounded-lg w-[1000px] max-h-[calc(100vh-200px)] overflow-y-auto shadow-lg dark:bg-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Score Analysis</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Current score and improvement */}
        <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${improvement.isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} dark:bg-opacity-20`}>
              {improvement.isPositive ? '↑' : '↓'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Improvement Between First and Last Performance in Time Period</p>
              <p className={`text-2xl font-bold ${improvement.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {improvement.isPositive ? '+' : '-'}{improvement.value} points
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{getAverageScore()}</p>
            </div>
          </div>
        </div>
        
        {/* Time frame selection */}
        <div className="px-6 py-4 flex items-center gap-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show:</p>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md cursor-pointer ${
                timeFrame === 'last10' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setTimeFrame('last10')}
            >
              Last 10 Performances
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md cursor-pointer ${
                timeFrame === 'last20' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setTimeFrame('last20')}
            >
              Last 20 Performances
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-md cursor-pointer ${
                timeFrame === 'all' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => setTimeFrame('all')}
            >
              All Performances
            </button>
          </div>
        </div>
        
        {/* Score chart */}
        <div className="px-6 pb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Score Trend</h3>
            </div>
            
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9CA3AF" 
                        tickFormatter={formatDate}
                        label={{ value: 'Date', position: 'insideBottom', offset: -15 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF" 
                        label={{ value: 'Score', angle: -90, position: 'insideLeft', offset: 10 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                        formatter={(value) => [`${value} points`, 'Score']}
                        labelFormatter={(label) => formatDate(label)}
                      />
                      <Legend verticalAlign="top" height={36} />
                      
                      {/* Target score zone */}
                      <ReferenceArea 
                        y1={IDEAL_MIN_SCORE} 
                        y2={IDEAL_MAX_SCORE} 
                        strokeOpacity={0} 
                        fill="green" 
                        fillOpacity={0.2}
                      />
                      <ReferenceLine 
                        y={IDEAL_MIN_SCORE} 
                        stroke="#9CA3AF" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: 'Target Score', 
                          position: 'right', 
                          style: { fill: '#9CA3AF', fontSize: 10 } 
                        }} 
                      />
                      
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        name="Score" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        dot={{ r: 4, fill: '#3B82F6', stroke: '#2563EB', strokeWidth: 1 }} 
                        activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#93C5FD' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                    <span>Score</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <span className="inline-block w-3 h-3 bg-green-500 bg-opacity-20 rounded-full mr-1"></span>
                    <span>Target Range ({IDEAL_MIN_SCORE}-{IDEAL_MAX_SCORE})</span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Performance insights */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance Insights</h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">High Score Count:</span> {scoreData.filter(item => item.score >= IDEAL_MIN_SCORE).length} out of {scoreData.length}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(scoreData.filter(item => item.score >= IDEAL_MIN_SCORE).length / scoreData.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span className="font-medium">Improvement Rate:</span> {improvement.isPositive ? 'Positive' : 'Negative'} trend
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {improvement.isPositive 
                    ? `Your scores have improved by ${improvement.value} points in this period.` 
                    : `Your scores have decreased by ${improvement.value} points in this period.`}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-30 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PerformanceScorePopup;