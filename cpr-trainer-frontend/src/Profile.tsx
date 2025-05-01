import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, User, Edit2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  
  // Username editing state
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState(false);

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
          setNewUsername(data.username);
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
  
  const handleUpdateUsername = async () => {
    if (newUsername.trim() === '') {
      setUsernameError('Username cannot be empty');
      return;
    }
    
    if (newUsername === userData.username) {
      setEditingUsername(false);
      return;
    }
    
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
      
      const response = await axios.post('/api/auth/update-username', {
        username: newUsername
      }, {
        headers: {
          Authorization: token
        }
      });
      
      // Update state with new username
      setUserData({...userData, username: newUsername});
      setUsernameSuccess(true);
      setUsernameError('');
      setEditingUsername(false);
      alert('Username updated successfully!');
      
      setTimeout(() => {
        setUsernameSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        setUsernameError(error.response.data);
      } else {
        setUsernameError('An error occurred. Please try again.');
      }
      alert('Failed to update username. Please try again.');
    }
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

          {usernameSuccess && (
            <div className="mb-4 flex items-center p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              <Check size={18} className="mr-2" />
              Username updated successfully!
            </div>
          )}
          {usernameError && (
            <div className="mb-4 flex items-center p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
              <X size={18} className="mr-2" />
              {usernameError}
            </div>
          )}

          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <div className="flex items-center">
                {editingUsername ? (
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-2">
                      <button
                        type="button"
                        onClick={handleUpdateUsername}
                        className="p-1 text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUsername(false);
                          setNewUsername(userData.username);
                          setUsernameError('');
                        }}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                      {userData.username}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingUsername(true)}
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Read Only)</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {userData.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name (Read Only)</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                {userData.firstname} {userData.surname}
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
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>

          {passwordSuccess && (
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-5 cursor-pointer"
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-5 cursor-pointer"
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-5 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
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