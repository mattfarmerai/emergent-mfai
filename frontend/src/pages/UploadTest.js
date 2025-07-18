import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Zap,
  Brain,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const UploadTest = () => {
  const { user, updateUserCredits } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  });

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file first');
      return;
    }

    if (user.credits < 1) {
      toast.error('Insufficient credits. Please buy credits first.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await api.post('/api/blood-test/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Blood test uploaded and analyzed successfully!');
      updateUserCredits(response.data.credits_remaining);
      navigate(`/report/${response.data.test_id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const steps = [
    {
      number: '01',
      title: 'Upload PDF',
      description: 'Select your dog\'s blood test PDF file',
      icon: Upload,
      active: !uploadedFile
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI analyzes the blood test parameters',
      icon: Brain,
      active: uploadedFile && !uploading
    },
    {
      number: '03',
      title: 'Get Results',
      description: 'View detailed analysis and chat with AI',
      icon: CheckCircle,
      active: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 cyber-grid-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-secondary-50/10 dark:from-primary-950/10 dark:to-secondary-950/10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6 neon-glow">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Blood Test
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your dog's blood test PDF and get instant AI-powered analysis
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full">
              <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {user.credits} credits available
              </span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Analysis in ~30 seconds
              </span>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex flex-col items-center ${step.active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    step.active 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">{step.number}</span>
                  <span className="text-xs text-center max-w-20">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-morphism rounded-2xl p-8 mb-8"
        >
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`file-upload-area ${isDragActive || dragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop your PDF here' : 'Upload Blood Test PDF'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop your PDF file here, or click to select
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    PDF only
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Max 10MB
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Button */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleUpload}
              disabled={uploading || user.credits < 1}
              className="cyber-button px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="loading-dots mr-3">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  Analyzing Blood Test...
                </div>
              ) : (
                <>
                  <Brain className="w-6 h-6 mr-2" />
                  Analyze Blood Test (1 Credit)
                </>
              )}
            </button>
            {user.credits < 1 && (
              <p className="mt-4 text-red-600 dark:text-red-400">
                You need at least 1 credit to analyze a blood test.{' '}
                <button
                  onClick={() => navigate('/buy-credits')}
                  className="underline hover:no-underline"
                >
                  Buy credits here
                </button>
              </p>
            )}
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-morphism rounded-2xl p-6 mt-8"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            What happens next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI extracts and analyzes all blood parameters
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get detailed analysis with explanations
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chat with AI and download PDF report
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadTest;