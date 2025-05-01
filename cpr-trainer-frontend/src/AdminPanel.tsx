import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  UserCircle,
  Mail,
  Key,
  Shield,
  ClipboardPen,
} from "lucide-react";
import TopBar from "./TopBar";
import User from "./types/User";
import { useNavigate } from "react-router";

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDropdownOpen, setIsDropdownOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch user info
  useEffect(() => {
    async function getUserInfo() {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      console.log(
        "Token retrieved:",
        token ? token.split("=")[1] : "No token found"
      );

      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token ? token.split("=")[1] : ""}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        setUserData(user);
        console.log("User data retrieved:", user);
        //if user is admin, redirect to admin page
        if (user.role !== "admin") {
          console.log("User is not admin, redirecting to login page");
          navigate("/login");
        } else {
          fetchAllUsers(user.id);
        }
      } else {
        console.error("Failed to fetch user data");
      }

      if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized access. Please log in again.");
        // Optionally, redirect to login page or show a message
        navigate("/login");
        //remove token from cookie
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }

    getUserInfo();
  }, []);

  async function fetchAllUsers(userId: number) {
    setIsLoading(true);
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    const response = await fetch("/api/auth/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token ? token.split("=")[1] : ""}`,
      },
    });

    if (response.ok) {
      const users = await response.json();
      //remove the current user from the list
      console.log("Current user ID:", userId);

      const filteredUsers = users.filter((user: User) => user.id !== userId);
      setUsers(filteredUsers);
      console.log("Users data retrieved:", users);
    } else {
      console.error("Failed to fetch users data");
    }
    setIsLoading(false);
  }

  // Sort users by registration date
  const handleSort = (): void => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);

    const sortedUsers = [...users].sort((a, b) => {
      if (newOrder === "desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    setUsers(sortedUsers);
  };

  // Toggle role dropdown
  const toggleRoleDropdown = (userId: number): void => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      Object.entries(dropdownRefs.current).forEach(([userId, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setIsDropdownOpen((prev) => ({
            ...prev,
            [userId]: false,
          }));
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRefs]);

  // Change user role
  const changeUserRole = async (
    userId: number,
    newRole: string
  ): Promise<boolean> => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const response = await fetch(`/api/auth/changeUserRole/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token ? token.split("=")[1] : ""}`,
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (response.ok) {
      // Update local state after successful API call
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setIsDropdownOpen((prev) => ({
        ...prev,
        [userId]: false,
      }));
      console.log(`User ${userId} role changed to ${newRole}`);
      alert(`User role changed to ${newRole}`);
      return true;
    } else {
      console.error("Failed to change user role");
      alert("Failed to change user role. Please try again.");
      return false;
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top navigation bar */}
      <TopBar />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Manage users and their roles
          </p>
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
                Sort by Registration Date
                <ChevronDown
                  className={`ml-1 h-4 w-4 transform ${
                    sortOrder === "desc" ? "" : "rotate-180"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">No users found</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <UserCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                        {user.firstname} {user.surname}
                      </span>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        @{user.username}
                      </span>
                    </div>

                    {/* Role Badge */}
                    <div
                      className="relative"
                      ref={(el) => (dropdownRefs.current[user.id] = el)}
                    >
                      <button
                        onClick={() => toggleRoleDropdown(user.id)}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded cursor-pointer
                        ${
                          user.role === "instructor"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                        } hover:bg-opacity-75 focus:outline-none`}
                      >
                        {user.role === "instructor" ? (
                          <ClipboardPen className="mr-1 h-3.5 w-3.5" />
                        ) : (
                          <UserCircle className="mr-1 h-3.5 w-3.5" />
                        )}

                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        <ChevronDown
                          className={`ml-1 h-3.5 w-3.5 transform ${
                            isDropdownOpen[user.id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDropdownOpen[user.id] && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10 transition-colors">
                          <div className="py-1">
                            <button
                              onClick={() => changeUserRole(user.id, "user")}
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 w-full text-left cursor-pointer"
                            >
                              User
                            </button>
                            <button
                              onClick={() =>
                                changeUserRole(user.id, "instructor")
                              }
                              className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 w-full text-left cursor-pointer"
                            >
                              Instructor
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </span>
                      <div className="mt-1 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        KHAS ID
                      </span>
                      <div className="mt-1 flex items-center">
                        <Key className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.khasID || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Registered Date
                      </span>
                      <div className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
