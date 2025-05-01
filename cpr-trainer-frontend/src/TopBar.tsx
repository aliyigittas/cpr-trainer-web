import { User, LogOut } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import cprLogo from "./assets/cprLogo.jpg";
import { useLocation, useNavigate } from "react-router";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const safeNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    // Expire token
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]}`,
      },
    });
    if (response.ok) {
      // Clear token from cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Redirect to login page
      navigate("/login");
    } else {
      console.error("Logout failed");
      alert("Logout failed. Please try again.");
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

            {/* Profile */}
            {window.location.pathname !== "/adminPanel" && (
              <button
                className="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                onClick={() => safeNavigate("/profile")}
              >
                <span className="sr-only">View profile</span>
                <User className="h-6 w-6" />
              </button>
            )}

            {/* Logout */}
            <button
              className="bg-white dark:bg-gray-800 p-1 rounded-full text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <span className="sr-only">Logout</span>
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
