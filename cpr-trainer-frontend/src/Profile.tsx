import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, User } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { useNavigate } from 'react-router-dom'; // react-router-dom'dan import edildi
import cprLogo from './assets/cprLogo.jpg';
import SHA256 from 'crypto-js/sha256';
import axios from "axios";
import TopBar from './TopBar';

interface UserData {
  id: number;
  firstname: string;
  surname: string;
  username: string;
  email: string;
  khasID: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    firstname: '',
    surname: '',
    username: '',
    email: '',
    khasID: '',
    role: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token ? token.split('=')[1] : ''}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Kullanıcı verilerini form alanlarına ata
          setFullName(`${data.firstname} ${data.surname}`);
          setEmail(data.email);
        } else {
          console.error('Kullanıcı bilgileri alınamadı');
          navigate('/login');
        }
      } catch (error) {
        console.error('Bir hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);
  
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // Bu fonksiyonu mevcut haliyle bırakıyoruz
    setInfoSaved(true);
    setTimeout(() => {
      setInfoSaved(false);
    }, 3000);
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      // Hash passwords like in login/register
      const hashedCurrentPassword = SHA256(currentPassword).toString();
      const hashedNewPassword = SHA256(newPassword).toString();
      
      const response = await axios.post('/api/auth/change-password', {
        currentPassword: hashedCurrentPassword,
        newPassword: hashedNewPassword
      }, {
        headers: {
          Authorization: `${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`
        }
      });
      
      // Clear fields and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(true);
      setPasswordError('');
      alert('Password changed successfully!');
      // Hide success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      // Handle errors
      if (error.response && error.response.data) {
        setPasswordError(error.response.data);
      } else {
        setPasswordError('An error occurred. Please try again.');
      }
      setPasswordSuccess(false);
      alert('Failed to change password. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Top Bar */}
      <TopBar />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>

          {infoSaved && (
            <div className="mb-4 flex items-center p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              <Check size={18} className="mr-2" />
              Information saved successfully!
            </div>
          )}

          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {userData.username}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {userData.email}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Created At</label>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400 text-sm border border-gray-300 dark:border-gray-600">
                {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not available'}
              </div>
            </div>
          </div>

          

          <form onSubmit={handleSaveInfo} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Information
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

          {passwordChanged && (
            <div className="mb-4 flex items-center p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              <Check size={18} className="mr-2" />
              Password changed successfully!
            </div>
          )}
          {passwordError && (
            <div className="mb-4 flex items-center p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
              <X size={18} className="mr-2" />
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-6">Danger Zone</h2>

          <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900 rounded-md p-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-100 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-300 border border-red-300 dark:border-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}