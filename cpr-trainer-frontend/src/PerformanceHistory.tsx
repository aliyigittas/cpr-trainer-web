import React, { useState, useRef, useEffect } from 'react';
import { Calendar, User, ChevronDown, Filter, Clock, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';

// Sample CPR performance data
const initialPerformances = [
  {
    id: 1,
    date: '2025-04-20',
    time: '10:30 AM',
    duration: '5m 42s',
    compressionRate: '110/min',
    compressionDepth: '2.2 inches',
    feedback: 'excellent',
    notes: 'Perfect rhythm maintenance throughout the session. Excellent depth consistency.'
  },
  {
    id: 2,
    date: '2025-04-15',
    time: '2:15 PM',
    duration: '4m 30s',
    compressionRate: '95/min',
    compressionDepth: '1.9 inches',
    feedback: 'good',
    notes: 'Good overall performance. Try to maintain slightly deeper compressions.'
  },
  {
    id: 3,
    date: '2025-04-10',
    time: '11:45 AM',
    duration: '6m 12s',
    compressionRate: '120/min',
    compressionDepth: '1.7 inches',
    feedback: 'needs-improvement',
    notes: 'Compression rate slightly too fast. Depth needs to be increased for effective CPR.'
  },
  {
    id: 4,
    date: '2025-04-05',
    time: '9:00 AM',
    duration: '5m 20s',
    compressionRate: '105/min',
    compressionDepth: '2.1 inches',
    feedback: 'excellent',
    notes: 'Excellent technique and endurance. Perfect example of high-quality CPR.'
  }
];

// Feedback badge component
const FeedbackBadge = ({ type }) => {
  const badges = {
    excellent: { color: 'bg-green-100 text-green-800', icon: <ThumbsUp size={16} className="mr-1" /> },
    good: { color: 'bg-blue-100 text-blue-800', icon: <ThumbsUp size={16} className="mr-1" /> },
    'needs-improvement': { color: 'bg-amber-100 text-amber-800', icon: <AlertTriangle size={16} className="mr-1" /> }
  };

  const { color, icon } = badges[type] || badges['good'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
};

// Main component
export default function CPRPerformanceDashboard() {
  const [performances, setPerformances] = useState(initialPerformances);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterFeedback, setFilterFeedback] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  
  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);
  
  // Sort performances by date
  const handleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    
    const sortedPerformances = [...performances].sort((a, b) => {
      if (newOrder === 'desc') {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
    
    setPerformances(sortedPerformances);
  };
  
  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Filter performances by feedback type
  const handleFilter = (feedbackType) => {
    setFilterFeedback(feedbackType);
    setIsFilterOpen(false);
  };
  
  // Apply filter
  const filteredPerformances = filterFeedback === 'all' 
    ? performances 
    : performances.filter(perf => perf.feedback === filterFeedback);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
                  CPR
                </div>
                <span className="ml-2 font-semibold text-gray-900">CPR Track</span>
              </div>
            </div>
            
            {/* Right section */}
            <div className="flex items-center">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <div className="relative">
                  <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
          <h1 className="text-2xl font-bold text-gray-900">CPR Performance History</h1>
          <p className="mt-1 text-sm text-gray-500">Track and analyze your CPR training sessions</p>
        </div>
        
        {/* Filters and sorting */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <button 
                onClick={handleSort}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                Sort by Date
                <ChevronDown className={`ml-1 h-4 w-4 transform ${sortOrder === 'desc' ? '' : 'rotate-180'}`} />
              </button>
            </div>
            
            <div className="relative" ref={filterRef}>
              <button 
                onClick={toggleFilterDropdown}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                Filter: {filterFeedback === 'all' ? 'All Sessions' : filterFeedback.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => handleFilter('all')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'all' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      All Sessions
                    </button>
                    <button 
                      onClick={() => handleFilter('excellent')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'excellent' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      Excellent
                    </button>
                    <button 
                      onClick={() => handleFilter('good')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'good' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      Good
                    </button>
                    <button 
                      onClick={() => handleFilter('needs-improvement')}
                      className={`block w-full text-left px-4 py-2 text-sm ${filterFeedback === 'needs-improvement' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      Needs Improvement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              New Session
            </button>
          </div>
        </div>
        
        {/* Performance cards */}
        <div className="space-y-6">
          {filteredPerformances.map((performance) => (
            <div key={performance.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-500">{formatDate(performance.date)}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-sm font-medium text-gray-500">{performance.time}</span>
                  </div>
                  <FeedbackBadge type={performance.feedback} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</span>
                    <span className="mt-1 text-lg font-semibold">{performance.duration}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Compression Rate</span>
                    <span className="mt-1 text-lg font-semibold">{performance.compressionRate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Compression Depth</span>
                    <span className="mt-1 text-lg font-semibold">{performance.compressionDepth}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">{performance.notes}</p>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}