import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 cyber-grid-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-secondary-50/10 dark:from-primary-950/10 dark:to-secondary-950/10"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-morphism rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/buy-credits"
              className="cyber-button"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Try Again
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              💡 <strong>Need help?</strong> Contact our support team if you're having trouble with payments.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;