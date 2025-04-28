import React, { useState, useRef, useEffect } from 'react';
import { Calendar, User, ChevronDown, Filter, Clock } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import cprLogo from './assets/cprLogo.jpg';
import Performance from './types/Performance';
import { useNavigate } from 'react-router';
import CPRPerformanceDetailPopup from './PerformanceDetails';

// TypeScript interfaces
type FeedbackType = 'A' | 'H' | 'V';

// Main component
function CPRPerformanceDashboard() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [depthData, setDepthData] = useState<{ compression: number; depth: number }[]>([]);
  const [freqData, setFreqData] = useState<{ compression: number; frequency: number }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<FeedbackType[]>([]);
  const filterRef = useRef<HTMLDivElement | null>(null);
   // Select all feedback types
   const selectAllTypes = (): void => {
    setSelectedTypes(['A', 'H', 'V']);
  };
  
  const navigate = useNavigate();

  // Handle viewing performance details
  const handleViewDetails = (performance: Performance) => {
    const minLength = Math.min(performance.depthArray.length, performance.freqArray.length);

    const newDepthData = performance.depthArray.slice(0, minLength).map((depthValue, index) => ({
      compression: index + 1,
      depth: Math.max(0, depthValue),
    }));
  
    const newFreqData = performance.freqArray.slice(0, minLength).map((freqValue, index) => ({
      compression: index + 1,
      frequency: Math.max(0, freqValue),
    }));

    setSelectedPerformance(performance);
    setDepthData(newDepthData);
    setFreqData(newFreqData);
    setShowPopup(true);
  };

  const formatTrainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (remainingSeconds === 60) {
      return `${minutes + 1}:00`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Toggle the filter dropdown
  const toggleFilterDropdown = (): void => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);
  
  // Toggle selection of a feedback type
  const toggleFeedbackType = (type: FeedbackType): void => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(item => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  // Format the selected types for display
  const getDisplayText = (): string => {
    if (selectedTypes.length === 0) return 'All Types';
    if (selectedTypes.length === 3) return 'All Types';
    return selectedTypes.join('-');
  };

  // Fetch user info
  useEffect(() => {
    async function getUserInfo() {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      console.log("Token retrieved:", token ? token.split('=')[1] : "No token found");
      
      const response = await fetch('api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token ? token.split('=')[1] : ''}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User data retrieved:", userData);
      } else {
        console.error("Failed to fetch user data");
      }
    }
    getUserInfo();
  }, []);

  // Fetch performance data
  useEffect(() => {
    async function fetchPerformances() {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      console.log("Token retrieved:", token ? token.split('=')[1] : "No token found");
      
      const response = await fetch('api/auth/getPerformance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token ? token.split('=')[1] : ''}`
        }
      });
      
      if (response.ok) {
        const performanceData = await response.json();
        console.log("Performance data retrieved:", performanceData);
        setPerformances(performanceData);
      } else {
        console.error("Failed to fetch performance data");
      }
    }
    fetchPerformances();
  }, []);
  
  // Sort performances by date
  const handleSort = (): void => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    const sortedPerformances = [...performances].sort((a, b) => {
      if (newOrder === 'desc') {
        return new Date(b.performanceDate).getTime() - new Date(a.performanceDate).getTime();
      } else {
        return new Date(a.performanceDate).getTime() - new Date(b.performanceDate).getTime();
      }
    });
    
    setPerformances(sortedPerformances);
  };
  
  // Filter performances based on selected feedback types
  const filteredPerformances = selectedTypes.length === 0
    ? performances
    : performances.filter(perf => {
        // Check if the performance's feedback type contains any of the selected types
        return selectedTypes.some(type => perf.feedbackType.includes(type));
      });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top navigation bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img src={cprLogo} alt="Logo" className="h-8 w-8 rounded-md" />
                <span className="ml-2 font-semibold text-gray-900 dark:text-white transition-colors">CPR Track</span>
              </div>
            </div>
            
            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <div className="ml-4 flex items-center">
                {/* Profile dropdown */}
                <div className="relative">
                  <button className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer">
                    <span className="sr-only">View profile</span>
                    <User className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">CPR Performance History</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">Track and analyze your CPR training sessions</p>
        </div>
        
        {/* Filters and sorting */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <button 
                onClick={handleSort}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Sort by Date
                <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? '' : 'rotate-180'}`} />
              </button>
            </div>
            
            <div className="relative" ref={filterRef}>
              <button 
                onClick={toggleFilterDropdown}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                <Filter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                Filter: {getDisplayText()}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10 transition-colors">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Feedback Types
                    </div>
                    <div className="px-4 py-1">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTypes.length === 3}
                          onChange={selectAllTypes}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-medium">All Types</span>
                      </label>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                    <div className="px-4 py-1">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTypes.includes('A')}
                          onChange={() => toggleFeedbackType('A')}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        Audio (A)
                      </label>
                    </div>
                    <div className="px-4 py-1">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTypes.includes('H')}
                          onChange={() => toggleFeedbackType('H')}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        Haptic (H)
                      </label>
                    </div>
                    <div className="px-4 py-1">
                      <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTypes.includes('V')}
                          onChange={() => toggleFeedbackType('V')}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        Visual (V)
                      </label>
                    </div>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => setSelectedTypes([])}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Performance cards */}
        <div className="space-y-6">
          {filteredPerformances.map((performance) => (
            <div key={performance.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-md transition-all">
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{formatDate(performance.performanceDate)}</span>
                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                    <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{performance.performanceDate}</span>
                  </div>
                  {/* Feedback Type Badge */}
                  <div className="flex space-x-1">
                    {performance.feedbackType.includes('A') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Audio
                      </span>
                    )}
                    {performance.feedbackType.includes('H') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                        Haptic
                      </span>
                    )}
                    {performance.feedbackType.includes('V') && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Visual
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</span>
                    <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{formatTrainingTime(performance.trainingTime)} min</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Compression Rate</span>
                    <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{performance.meanFreq}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Compression Depth</span>
                    <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{performance.meanDepth}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Notes</p>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => handleViewDetails(performance)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Detail Popup */}
      {showPopup && selectedPerformance && (
        <CPRPerformanceDetailPopup
          performance={selectedPerformance}
          depthData={depthData}
          freqData={freqData}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default CPRPerformanceDashboard;