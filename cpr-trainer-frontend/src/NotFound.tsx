import { useNavigate } from "react-router";
import { AlertTriangle, Home } from "lucide-react";
import TopBar from "./TopBar";
import { useEffect } from "react";

function NotFound() {
  const navigate = useNavigate();

  // Change page title
  useEffect(() => {
    document.title = "404 - CPR Trainer";
  }, []);

  // Handle manual navigation
  const goHome = () => {
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top navigation bar */}
      <TopBar />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 mb-8">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white transition-colors mb-4">
            404
          </h1>
          
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 transition-colors mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors max-w-md mx-auto mb-8">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={goHome}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto justify-center cursor-pointer"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;