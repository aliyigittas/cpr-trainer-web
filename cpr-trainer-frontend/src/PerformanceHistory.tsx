import React, { useState, useRef, useEffect } from 'react';
import { Calendar, User, ChevronDown, Filter, Clock } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import cprLogo from './assets/cprLogo.jpg';
import Performance from './types/Performance';
import { useNavigate } from 'react-router';
import CPRPerformanceDetailPopup from './PerformanceDetails';

// Theme Context

// TypeScript interfaces

type FeedbackType = 'all' | 'excellent' | 'good' | 'needs-improvement';


// interface BadgeConfig {
//   color: string;
//   icon: React.ReactNode;
// }

// Sample CPR performance data
// const initialPerformances: Performance[] = [
//   {
//     id: 1,
//     date: '2025-04-20',
//     time: '10:30 AM',
//     duration: '5m 42s',
//     compressionRate: '110/min',
//     compressionDepth: '2.2 inches',
//     feedback: 'excellent',
//     notes: 'Perfect rhythm maintenance throughout the session. Excellent depth consistency.'
//   },
//   {
//     id: 2,
//     date: '2025-04-15',
//     time: '2:15 PM',
//     duration: '4m 30s',
//     compressionRate: '95/min',
//     compressionDepth: '1.9 inches',
//     feedback: 'good',
//     notes: 'Good overall performance. Try to maintain slightly deeper compressions.'
//   },
//   {
//     id: 3,
//     date: '2025-04-10',
//     time: '11:45 AM',
//     duration: '6m 12s',
//     compressionRate: '120/min',
//     compressionDepth: '1.7 inches',
//     feedback: 'needs-improvement',
//     notes: 'Compression rate slightly too fast. Depth needs to be increased for effective CPR.'
//   },
//   {
//     id: 4,
//     date: '2025-04-05',
//     time: '9:00 AM',
//     duration: '5m 20s',
//     compressionRate: '105/min',
//     compressionDepth: '2.1 inches',
//     feedback: 'excellent',
//     notes: 'Excellent technique and endurance. Perfect example of high-quality CPR.'
//   }
// ];

// Feedback badge component
// const FeedbackBadge: React.FC<FeedbackBadgeProps> = ({ type }) => {
//   const badges: Record<Performance['feedback'], BadgeConfig> = {
//     excellent: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100', icon: <ThumbsUp size={16} className="mr-1" /> },
//     good: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100', icon: <ThumbsUp size={16} className="mr-1" /> },
//     'needs-improvement': { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100', icon: <AlertTriangle size={16} className="mr-1" /> }
//   };

//   const { color, icon } = badges[type];
  
//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
//       {icon}
//       {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
//     </span>
//   );
// };



// Main component
function CPRPerformanceDashboard() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterFeedback, setFilterFeedback] = useState<FeedbackType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);

  const handleViewDetails = (performance: Performance) => {
    setSelectedPerformance(performance);
    setShowPopup(true);
  };

  //get cookie token
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserInfo(){
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      console.log("Token retrieved:", token ? token.split('=')[1] : "No token found");
      //fetch user data User type with Authorization header
      const response = await fetch('api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token ? token.split('=')[1] : ''}`
        }
      })

      if (response.ok) {
        const userData = await response.json();
        console.log("User data retrieved:", userData);
      } else {
        console.error("Failed to fetch user data");
      }
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    async function fetchPerformances() {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      console.log("Token retrieved:", token ? token.split('=')[1] : "No token found");
      //fetch performance data with Authorization header
      const response = await fetch('api/auth/getPerformance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token ? token.split('=')[1] : ''}`
        }
      })
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
  
  // Toggle filter dropdown
  const toggleFilterDropdown = (): void => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Filter performances by feedback type
  const handleFilter = (feedbackType: FeedbackType): void => {
    setFilterFeedback(feedbackType);
    setIsFilterOpen(false);
  };
  
  // Apply filter
  const filteredPerformances = filterFeedback === 'all' 
    ? performances 
    : performances.filter(perf => perf.feedbackType === filterFeedback);

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
                Filter: {filterFeedback === 'all' ? 'All Sessions' : filterFeedback.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10 transition-colors">
                  <div className="py-1">
                    <button 
                      onClick={() => handleFilter('all')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'all' ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900' : 'text-gray-700 dark:text-gray-200'} transition-colors cursor-pointer`}
                    >
                      All Sessions
                    </button>
                    <button 
                      onClick={() => handleFilter('excellent')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'excellent' ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900' : 'text-gray-700 dark:text-gray-200'} transition-colors cursor-pointer`}
                    >
                      Excellent
                    </button>
                    <button 
                      onClick={() => handleFilter('good')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'good' ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900' : 'text-gray-700 dark:text-gray-200'} transition-colors cursor-pointer`}
                    >
                      Good
                    </button>
                    <button 
                      onClick={() => handleFilter('needs-improvement')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'needs-improvement' ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-900' : 'text-gray-700 dark:text-gray-200'} transition-colors cursor-pointer`}
                    >
                      Needs Improvement
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
                  {/* <FeedbackBadge type={performance.feedback} /> */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</span>
                    <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{performance.trainingTime}</span>
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
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"   onClick={() => handleViewDetails(performance)}

                  >View Details</button>
                  {showPopup && selectedPerformance && (
                    <CPRPerformanceDetailPopup
                      performance={selectedPerformance}
                      onClose={() => setShowPopup(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CPRPerformanceDashboard