import { useEffect, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import { useNavigate } from "react-router";
import axios, { AxiosError } from "axios";
import SHA256 from 'crypto-js/sha256';
// Login Page Component
export default function LoginPage() {
  //use react navigation to redirect to register page
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Login attempt with:", { username, password });

      // Backend'e POST isteği yapıyoruz
      // Şifreyi SHA256 ile hash'liyoruz
      const hashedPassword = SHA256(password).toString();
      const response = await axios.post('api/auth/login', {
        username: username,
        password: hashedPassword,
      });

      // Backend'den gelen token'ı alıyoruz
      console.log('Response from server:', response.data);
      const { token } = response.data;

      // Token'ı state'e kaydediyoruz
      setToken(response.data.token);

      console.log('Token received:', token);
      // Token ile yapılacak işlemleri burada ekleyebilirsin (örneğin, auth context veya localStorage)
      //set token to cookie
      // Remember me seçeneğine göre cookie süresini ayarla
      if (rememberMe) {
        // 7 gün geçerli olacak cookie
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        document.cookie = `token=${token}; path=/; expires=${expires.toUTCString()};`;
      } else {
        // Session cookie (tarayıcı kapanınca silinir)
        document.cookie = `token=${token}; path=/;`;
      }
      // Redirect to performance history page
      navigate("/performanceHistory");
    } catch (err: unknown) {
      console.error('Login failed:', (err as AxiosError).message);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  //if user has logged in already
  useEffect(() => {
    //check if token cookie exists
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      const tokenValue = tokenCookie.split('=')[1];
      setToken(tokenValue);
      console.log('Token found in cookie:', tokenValue);
      // Redirect to performance history page
      navigate("/performanceHistory");
    } else {
      console.log('No token found in cookie');
    }
  },[])

  return (
    <div className="flex min-h-screen items-center justify-center transition-colors duration-300 dark:bg-gray-900 bg-gray-100">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="on"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm ">
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn size={16} className="h-5 w-5" aria-hidden="true" />
              </span>
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 ">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                navigate("/register");
              }}
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
