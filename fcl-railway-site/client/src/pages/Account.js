import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Account = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileInputChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user?.displayName}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-outline btn-sm"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                          <button
                            onClick={handleProfileSubmit}
                            className="btn btn-primary btn-sm"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={profileData.displayName}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <select
                            name="country"
                            value={profileData.country}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileInputChange}
                          disabled={!isEditing}
                          className="input w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={profileData.state}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zip"
                            value={profileData.zip}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <a
                        href="/products"
                        className="btn btn-primary"
                      >
                        Start Shopping
                      </a>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                    
                    {/* Change Password */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                        {!isChangingPassword ? (
                          <button
                            onClick={() => setIsChangingPassword(true)}
                            className="btn btn-outline btn-sm"
                          >
                            Change
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsChangingPassword(false)}
                              className="btn btn-outline btn-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handlePasswordSubmit}
                              className="btn btn-primary btn-sm"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      {isChangingPassword && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                                className="input w-full pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                className="input w-full pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showNewPassword ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                              className="input w-full"
                            />
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Account Actions */}
                    <div className="mt-8 border border-red-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="btn bg-red-600 text-white hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
