import { User } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import cprLogo from "./assets/cprLogo.jpg";
import { useLocation, useNavigate } from "react-router";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  //this function checks if the current path is different from the target path
  const safeNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => safeNavigate("/performanceHistory")}
          >
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img src={cprLogo} alt="Logo" className="h-8 w-8 rounded-md" />
              <span className="ml-2 font-semibold text-gray-900 dark:text-white transition-colors">
                CPR Track
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            <div className="ml-4 flex items-center">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                  onClick={() => safeNavigate("/profile")}
                >
                  <span className="sr-only">View profile</span>
                  <User className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
