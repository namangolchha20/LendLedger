import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const { user, userName } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userName || user?.email?.split('@')[0]}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'recently'}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
            <Shield className="w-4 h-4" />
            <span>Account status: Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;