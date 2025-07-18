import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Download, 
  Plus, 
  Calendar, 
  Clock,
  CreditCard,
  Zap,
  Activity,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [bloodTests, setBloodTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    thisMonth: 0,
    creditsUsed: 0
  });

  useEffect(() => {
    fetchBloodTests();
  }, []);

  const fetchBloodTests = async () => {
    try {
      const response = await api.get('/api/user/blood-tests');
      setBloodTests(response.data);
      
      // Calculate stats
      const now = new Date();
      const thisMonth = response.data.filter(test => {
        const testDate = new Date(test.created_at);
        return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear();
      }).length;
      
      setStats({
        totalTests: response.data.length,
        thisMonth,
        creditsUsed: response.data.length
      });
    } catch (error) {
      toast.error('Failed to fetch blood tests');
      console.error('Error fetching blood tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statCards = [
    {
      title: 'Total Tests',
      value: stats.totalTests,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'This Month',
      value: stats.thisMonth,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Credits Used',
      value: stats.creditsUsed,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Available Credits',
      value: user?.credits || 0,
      icon: Zap,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 cyber-grid-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-secondary-50/10 dark:from-primary-950/10 dark:to-secondary-950/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your dog's health with AI-powered blood test analysis
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                to="/upload"
                className="cyber-button"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Test
              </Link>
              <Link
                to="/buy-credits"
                className="px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Buy Credits
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-morphism rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Blood Tests
            </h2>
            {bloodTests.length > 0 && (
              <Link
                to="/upload"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200"
              >
                Upload New Test
              </Link>
            )}
          </div>

          {bloodTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No blood tests yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload your first blood test to get started with AI analysis
              </p>
              <Link
                to="/upload"
                className="cyber-button"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Test
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bloodTests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {test.filename}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(test.created_at)}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            test.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/report/${test.id}`}
                        className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                      >
                        <FileText className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/chat/${test.id}`}
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-morphism rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Test
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload a new blood test PDF for AI analysis
            </p>
            <Link
              to="/upload"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Get Started →
            </Link>
          </div>

          <div className="glass-morphism rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Chat with AI
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ask questions about your dog's blood test results
            </p>
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {bloodTests.length > 0 ? 'Select a test →' : 'Upload first test →'}
            </span>
          </div>

          <div className="glass-morphism rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Buy Credits
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Purchase analysis credits for $97 each
            </p>
            <Link
              to="/buy-credits"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Buy Now →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;