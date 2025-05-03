import {
  LogIn,
  UserPlus,
  Activity,
  Award,
  Shield,
  ClipboardPen,
} from "lucide-react";
import TopBar from "./TopBar";
import cprLogo from "./assets/cprLogo.png";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function Introduction() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      navigate("/performanceHistory");
    }
  }, [navigate]);

  return (
    <div
      className={`min-h-screen dark:bg-gray-900 dark:text-white bg-gray-50 text-gray-900 transition-colors duration-200`}
    >
      <TopBar />

      {/* Hero section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Advanced Training Technology
                </span>
                <span
                  className={`mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl dark:text-white text-gray-900`}
                >
                  Master CPR Skills with Real-time Feedback
                </span>
              </h1>
              <p
                className={`mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl dark:text-gray-300 text-gray-500`}
              >
                Our advanced CPR training system provides real-time feedback
                through audio, visual, and haptic cues to help you perfect your
                technique. Track your progress, analyze performance metrics, and
                improve your life-saving skills.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get Started
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className={`w-full flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-300 text-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors`}
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <img
                className="w-[300px] h-[300px] object-cover lg:w-full lg:h-full rounded-lg"
                src={cprLogo}
                alt="CPR training illustration"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className={`py-12 sm:py-16 dark:bg-gray-800 bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p
              className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl dark:text-white text-gray-900`}
            >
              Everything you need to perfect your CPR technique
            </p>
            <p
              className={`mt-4 max-w-2xl text-xl dark:text-gray-300 text-gray-500 lg:mx-auto`}
            >
              Our comprehensive training system combines advanced sensors with
              intuitive feedback to help healthcare professionals and
              individuals alike master CPR skills.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md dark:bg-blue-700 bg-blue-500 text-white`}
                  >
                    <Activity className="h-6 w-6" />
                  </div>
                  <p
                    className={`ml-16 text-lg font-medium dark:text-white text-gray-900`}
                  >
                    Real-time Feedback
                  </p>
                </dt>
                <dd
                  className={`mt-2 ml-16 text-base dark:text-gray-300 text-gray-500`}
                >
                  Receive instant visual, audio, and haptic feedback on your
                  compression rate, depth, and arm position to ensure proper
                  technique.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md dark:bg-blue-700 bg-blue-500 text-white`}
                  >
                    <Award className="h-6 w-6" />
                  </div>
                  <p
                    className={`ml-16 text-lg font-medium dark:text-white text-gray-900`}
                  >
                    Comprehensive Analytics
                  </p>
                </dt>
                <dd
                  className={`mt-2 ml-16 text-base dark:text-gray-300 text-gray-500`}
                >
                  Track your performance over time with detailed metrics,
                  graphs, and personalized improvement suggestions.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md dark:bg-blue-700 bg-blue-500 text-white`}
                  >
                    <ClipboardPen className="h-6 w-6" />
                  </div>
                  <p
                    className={`ml-16 text-lg font-medium dark:text-white text-gray-900`}
                  >
                    Expert Guidance
                  </p>
                </dt>
                <dd
                  className={`mt-2 ml-16 text-base dark:text-gray-300 text-gray-500`}
                >
                  Access instructor notes and AI-powered insights to help
                  identify areas for improvement and refine your technique.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md dark:bg-blue-700 bg-blue-500 text-white`}
                  >
                    <Shield className="h-6 w-6" />
                  </div>
                  <p
                    className={`ml-16 text-lg font-medium dark:text-white text-gray-900`}
                  >
                    Secure and Private
                  </p>
                </dt>
                <dd
                  className={`mt-2 ml-16 text-base dark:text-gray-300 text-gray-500`}
                >
                  Your data is stored securely and privately, ensuring that your
                  training progress remains confidential.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-12 dark:bg-gray-900 bg-gray-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`py-10 px-6 rounded-lg md:py-16 md:px-12 lg:px-16 lg:flex lg:items-center lg:justify-between dark:bg-gray-800 bg-white shadow-xl`}
          >
            <div>
              <h2
                className={`text-2xl font-extrabold tracking-tight dark:text-white text-gray-900 sm:text-3xl`}
              >
                <span className="block">Ready to improve your skills?</span>
                <span className="block text-blue-600">
                  Create an account or sign in now.
                </span>
              </h2>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Register
                </a>
              </div>
              <div className="inline-flex">
                <a
                  href="/login"
                  className={`inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md dark:border-gray-700 dark:text-white dark:hover:bg-gray-600 dark:bg-gray-700 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors`}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`dark:bg-gray-900 dark:border-t dark:border-gray-800 bg-gray-50 border-t border-gray-200`}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <img
                src={cprLogo}
                alt="CPR Trainer Logo"
                className="h-10 w-10 rounded"
              />
              <span className="ml-2 text-lg font-bold">CPR Track</span>
            </div>
            <p className={`mt-4 text-sm dark:text-gray-400 text-gray-500`}>
              © {new Date().getFullYear()} CPR Trainer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Introduction;
