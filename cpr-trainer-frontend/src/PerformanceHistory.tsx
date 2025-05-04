import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Filter,
  Clock,
  UserCircle2Icon,
  Award,
} from "lucide-react";
import Performance from "./types/Performance";
import CPRPerformanceDetailPopup from "./PerformanceDetails";
import TopBar from "./TopBar";
import User from "./types/User";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import PerformanceNote from "./types/PerformanceNote";
import PerformanceScorePopup from "./ProgressReport";

// TypeScript interfaces
type FeedbackType = "A" | "H" | "V";
// not mandatory field id
function CPRPerformanceDashboard() {
  const { id } = useParams<{ id?: string }>();
  const numericId = id ? parseInt(id, 10) : undefined;

  const [performances, setPerformances] = useState<Performance[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showPopup, setShowPopup] = useState(false);
  const [showProgressPopup, setShowProgressPopup] = useState(false);
  const [selectedPerformance, setSelectedPerformance] =
    useState<Performance | null>(null);
  const [depthData, setDepthData] = useState<
    { compression: number; depth: number }[]
  >([]);
  const [freqData, setFreqData] = useState<
    { compression: number; frequency: number }[]
  >([]);
  const [positionData, setPositionData] = useState<
    { compression: number; position: number }[]
  >([]);
  const [userData, setUserData] = useState<User>({
    id: -1,
    firstname: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    khasID: "",
    role: "",
    createdAt: "",
    status: 0,
  });
  const navigate = useNavigate();

  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState<boolean>(false);
  const [selectedFeedbackTypes, setSelectedFeedbackTypes] = useState<
    FeedbackType[]
  >([]);
  const typeFilterRef = useRef<HTMLDivElement | null>(null);
  const [usernames, setUsernames] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [performanceNotesMap, setPerformanceNotesMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedNoteStatuses, setSelectedNoteStatuses] = useState<string[]>(
    []
  );
  const [isNoteFilterOpen, setIsNoteFilterOpen] = useState(false);
  const noteFilterRef = useRef<HTMLDivElement | null>(null);
  const [aiNotes, setAiNotes] = useState<PerformanceNote[]>([]);
  const [instructorNote, setInstructorNote] = useState<string[]>([]);

  // Select all feedback types
  const selectAllFeedbackTypes = (): void => {
    setSelectedFeedbackTypes(["A", "H", "V"]);
  };

  const toggleNoteStatus = (status: "noted" | "not-noted") => {
    if (selectedNoteStatuses.includes(status)) {
      setSelectedNoteStatuses(selectedNoteStatuses.filter((s) => s !== status));
    } else {
      setSelectedNoteStatuses([...selectedNoteStatuses, status]);
    }
  };

  const selectAllNoteStatuses = () => {
    setSelectedNoteStatuses(["noted", "not-noted"]);
  };

  const clearNoteFilters = () => {
    setSelectedNoteStatuses([]);
  };

  const getNoteFilterLabel = () => {
    if (
      selectedNoteStatuses.length === 0 ||
      selectedNoteStatuses.length === 2
    ) {
      return "All Notes";
    } else if (selectedNoteStatuses.includes("noted")) {
      return "Noted Only";
    } else {
      return "Not Noted";
    }
  };

  // Handle viewing performance details
  const handleViewDetails = (performance: Performance) => {
    const minLength = Math.min(
      performance.depthArray.length,
      performance.freqArray.length
    );

    const newDepthData = performance.depthArray
      .slice(0, minLength)
      .map((depthValue, index) => ({
        compression: index + 1,
        depth: Math.max(0, depthValue),
      }));

    const newFreqData = performance.freqArray
      .slice(0, minLength)
      .map((freqValue, index) => ({
        compression: index + 1,
        frequency: Math.max(0, freqValue),
      }));

    const newPositionData = performance.positionArray.map(
      (positionValue, index) => ({
        compression: index + 1,
        position: Math.max(0, positionValue),
      })
    );

    setSelectedPerformance(performance);
    setDepthData(newDepthData);
    setFreqData(newFreqData);
    setPositionData(newPositionData);
    setShowPopup(true);
    // URL'yi güncelle (sayfa yenilenmez)
    navigate(`/performanceHistory/${performance.id}`, { replace: true });
  };

  const handleViewProgress = () => {
    setShowProgressPopup(true);
    navigate(`/performanceHistory/scoreProgress`, { replace: true });
  };

  const formatTrainingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    if (remainingSeconds === 60) {
      return `${minutes + 1}:00`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const fetchUsernames = async (performances: Performance[]) => {
    if (userData.role !== "instructor") return;
    const uniqueIds = [...new Set(performances.map((p) => p.uid))];

    const userMap: { [key: number]: string } = {};
    await Promise.all(
      uniqueIds.map(async (uid: number) => {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));
        console.log(
          "Token retrieved:",
          token ? token.split("=")[1] : "No token found"
        );

        const response = await fetch(`/api/auth/getUsername?uid=${uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token ? token.split("=")[1] : ""}`,
          },
        });

        const username = await response.text();
        userMap[uid] = username;
      })
    );

    setUsernames(userMap);
    console.log("username:", usernames);
  };

  // Toggle the filter dropdown
  const toggleFeedackFilterDropdown = (): void => {
    setIsTypeFilterOpen(!isTypeFilterOpen);
  };

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        typeFilterRef.current &&
        !typeFilterRef.current.contains(event.target as Node)
      ) {
        setIsTypeFilterOpen(false);
      }
      if (
        noteFilterRef.current &&
        !noteFilterRef.current.contains(event.target as Node)
      ) {
        setIsNoteFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [typeFilterRef, noteFilterRef]);

  // Toggle selection of a feedback type
  const toggleFeedbackType = (type: FeedbackType): void => {
    if (selectedFeedbackTypes.includes(type)) {
      setSelectedFeedbackTypes(
        selectedFeedbackTypes.filter((item) => item !== type)
      );
    } else {
      setSelectedFeedbackTypes([...selectedFeedbackTypes, type]);
    }
  };

  // Format the selected types for display
  const getDisplayText = (): string => {
    if (selectedFeedbackTypes.length === 0) return "All Types";
    if (selectedFeedbackTypes.length === 3) return "All Types";
    return selectedFeedbackTypes.join("-");
  };

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
        if (user.role === "admin") {
          console.log("User is admin, redirecting to admin page");
          navigate("/adminPanel");
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

  useEffect(() => {
    if (performances.length > 0) {
      fetchUsernames(performances);
    }
  }, [performances]);

  // Fetch performance data
  useEffect(() => {
    async function fetchPerformances() {
      if (userData.role === "admin") return;
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      console.log(
        "Token retrieved:",
        token ? token.split("=")[1] : "No token found"
      );

      const response = await fetch("/api/auth/getPerformance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token ? token.split("=")[1] : ""}`,
        },
      });

      if (response.ok) {
        const performanceData = await response.json();
        const sortedData = performanceData.sort(
          (a: Performance, b: Performance) =>
            new Date(b.performanceDate).getTime() - new Date(a.performanceDate).getTime()
        );
        setPerformances(sortedData);
        const notesMap: { [key: number]: boolean } = {};
        await Promise.all(
          performanceData.map(async (perf: Performance) => {
            const token = document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="));
            const response = await fetch(
              `/api/auth/getPerformanceNotes?param=${perf.id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `${token ? token.split("=")[1] : ""}`,
                },
              }
            );

            if (response.ok) {
              const notes = await response.json();
              const instructorNoteArray: string[] = [];
              const aiNotesArray: PerformanceNote[] = [];

              notes.forEach(
                (noteObj: {
                  id: number;
                  performanceid: number;
                  notetype: string;
                  note: string;
                }) => {
                  if (noteObj.notetype === "H") {
                    instructorNoteArray.push(noteObj.note);
                  } else if (noteObj.notetype === "A") {
                    const parsedNotes: PerformanceNote[] = noteObj.note
                      ? JSON.parse(noteObj.note)
                      : [];
                    aiNotesArray.push(...parsedNotes);
                  }
                }
              );

              notesMap[perf.id] = notes.some(
                (n: {
                  id: number;
                  performanceid: number;
                  notetype: string;
                  note: string;
                }) => n.notetype === "H"
              );
            } else {
              notesMap[perf.id] = false;
            }
          })
        );
        setPerformanceNotesMap(notesMap);
        setAiNotes(aiNotes);
        setInstructorNote(instructorNote);
        console.log("Notes map:", notesMap);

        console.log("Performance data retrieved:", performanceData);
        // If an ID is provided, filter the performance data
        if (numericId) {
          console.log("Filtering performance data for ID:", numericId);
          const filteredPerformance = performanceData.find(
            (performance: Performance) => performance.id === numericId
          );
          if (filteredPerformance) {
            handleViewDetails(filteredPerformance);
          } else {
            console.error("Performance not found");
          }
        }
        setIsLoading(false);
      } else {
        console.error("Failed to fetch performance data");
        setIsLoading(false);
      }
    }
    fetchPerformances();
  }, []);

  // Sort performances by date
  const handleSort = (): void => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);

    const sortedPerformances = [...performances].sort((a, b) => {
      if (newOrder === "desc") {
        return (
          new Date(b.performanceDate).getTime() -
          new Date(a.performanceDate).getTime()
        );
      } else {
        return (
          new Date(a.performanceDate).getTime() -
          new Date(b.performanceDate).getTime()
        );
      }
    });

    setPerformances(sortedPerformances);
  };

  // Filter performances based on selected feedback types
  const filteredPerformances = performances.filter((perf) => {
    // feedback type match
    const feedbackMatch =
  selectedFeedbackTypes.length === 0 ||
  selectedFeedbackTypes.every(() => {
    // Create a string of the selected feedback types in the V, A, H order
    const selectedTypesString = selectedFeedbackTypes
      .sort((a, b) => ["V", "A", "H"].indexOf(a) - ["V", "A", "H"].indexOf(b))
      .join('');

    // Check if the performance feedbackType matches the selected combination
    return perf.feedbackType === selectedTypesString;
  });

    // note status match
    const hasNote = performanceNotesMap[perf.id] ?? false;

    const noteMatch =
      selectedNoteStatuses.length === 0 || // no filter
      selectedNoteStatuses.length === 2 || // both filters = all
      (selectedNoteStatuses.includes("noted") && hasNote) ||
      (selectedNoteStatuses.includes("not-noted") && !hasNote);

    return feedbackMatch && noteMatch;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string): string => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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
            { userData.role === "instructor"
              ? "Instructor Dashboard"
              :
            "CPR Performance History"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            { userData.role === "instructor"
              ? "View and manage your students' CPR performance data."
              :
            "View your CPR performance history and feedback."}
          </p>
        </div>

        {/* Filters and sorting */}
        <div className="flex justify-between items-center mb-6 space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <button
                  onClick={handleSort}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Sort by Date
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transform ${
                      sortOrder === "desc" ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </div>

              <div className="relative" ref={typeFilterRef}>
                <button
                  onClick={toggleFeedackFilterDropdown}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Filter: {getDisplayText()}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transform ${
                      isTypeFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isTypeFilterOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10 transition-colors">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Feedback Types
                      </div>
                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeedbackTypes.length === 3}
                            onChange={selectAllFeedbackTypes}
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
                            checked={selectedFeedbackTypes.includes("A")}
                            onChange={() => toggleFeedbackType("A")}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          Audio (A)
                        </label>
                      </div>
                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeedbackTypes.includes("H")}
                            onChange={() => toggleFeedbackType("H")}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          Haptic (H)
                        </label>
                      </div>
                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeedbackTypes.includes("V")}
                            onChange={() => toggleFeedbackType("V")}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          Visual (V)
                        </label>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => setSelectedFeedbackTypes([])}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={noteFilterRef}>
                <button
                  onClick={() => setIsNoteFilterOpen(!isNoteFilterOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                  <Filter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Filter: {getNoteFilterLabel()}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transform ${
                      isNoteFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isNoteFilterOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-600 focus:outline-none z-10 transition-colors">
                    <div className="py-1">
                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNoteStatuses.length === 2}
                            onChange={selectAllNoteStatuses}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="font-medium">All Notes</span>
                        </label>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>

                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNoteStatuses.includes("noted")}
                            onChange={() => toggleNoteStatus("noted")}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          Noted Only
                        </label>
                      </div>

                      <div className="px-4 py-1">
                        <label className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedNoteStatuses.includes("not-noted")}
                            onChange={() => toggleNoteStatus("not-noted")}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          Not Noted
                        </label>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={clearNoteFilters}
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
          {userData.role == "user" && (
            <button
              onClick={handleViewProgress}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
            >
              <Award className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              View Progress
            </button>
          )}
        </div>

        {/* Performance cards */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-row justify-center bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              {/* Loading spinner or icon */}
              <div className="animate-spin h-5 w-5 border-3 border-blue-500 border-t-transparent rounded-full mr-3 mt-0.5"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading performances...
              </p>
            </div>
          ) : filteredPerformances.length > 0 ? (
            filteredPerformances.map((performance) => (
              <div
                key={performance.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {formatDate(performance.performanceDate)}
                      </span>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {formatTime(performance.performanceDate)}
                      </span>
                      {userData.role === "instructor" && (
                        <>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">
                            •
                          </span>
                          <UserCircle2Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                            {usernames[performance.uid] || "Unknown User"}
                          </span>
                        </>
                      )}
                    </div>
                    {/* Feedback Type Badge */}
                    <div className="flex space-x-1">
                      {performance.feedbackType.includes("A") && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          Audio
                        </span>
                      )}
                      {performance.feedbackType.includes("H") && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                          Haptic
                        </span>
                      )}
                      {performance.feedbackType.includes("V") && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          Visual
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Duration
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {formatTrainingTime(performance.trainingTime)} min
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Compression Rate
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {performance.meanFreq}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Compression Depth
                      </span>
                      <span className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {performance.meanDepth}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Notes
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                      onClick={() => handleViewDetails(performance)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No performances found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Detail Popup */}
      {showPopup && selectedPerformance && (
        <CPRPerformanceDetailPopup
          performance={selectedPerformance}
          depthData={depthData}
          freqData={freqData}
          positionData={positionData}
          role={userData.role}
          onClose={() => {
            setShowPopup(false);
            // URL'yi güncelle (sayfa yenilenmez)
            navigate(`/performanceHistory`, { replace: true });
          }}
        />
      )}

      {/*Performance Progress Popup */}
      {showProgressPopup && performances && (
        <PerformanceScorePopup
          performance={performances}
          onClose={() => {
            setShowProgressPopup(false);
            navigate(`/performanceHistory`, { replace: true });
          }}
        />
      )}
    </div>
  );
}

export default CPRPerformanceDashboard;
