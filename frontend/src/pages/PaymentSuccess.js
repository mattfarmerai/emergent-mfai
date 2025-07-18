import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, ArrowRight, Sparkles } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [sessionDetails, setSessionDetails] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus(sessionId);
    }
  }, [sessionId]);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/status/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      setSessionDetails(data);
      
      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        return;
      }

      // Continue polling
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
    }
  };

  const getCreditsFromAmount = (amount) => {
    if (!amount) return 0;
    return Math.round(amount / 97);
  };

  const renderContent = () => {
    switch (paymentStatus) {
      case 'checking':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Verifying Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we confirm your payment...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for your purchase. Your credits have been added to your account.
            </p>
            {sessionDetails && (
              <div className="glass-morphism rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Credits Purchased:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getCreditsFromAmount(sessionDetails.amount_total)} credits
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(sessionDetails.amount_total / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                    Paid
                  </span>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="cyber-button"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/upload"
                className="px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Upload Blood Test
              </Link>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Session Expired
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your payment session has expired. Please try again.
            </p>
            <Link
              to="/buy-credits"
              className="cyber-button"
            >
              Try Again
            </Link>
          </div>
        );

      case 'timeout':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Verification Timeout
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're having trouble verifying your payment. Please check your email for confirmation or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="cyber-button"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/buy-credits"
                className="px-6 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-300"
              >
                Buy Credits Again
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There was an error processing your payment. Please try again or contact support.
            </p>
            <Link
              to="/buy-credits"
              className="cyber-button"
            >
              Try Again
            </Link>
          </div>
        );
    }
  };

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
          className="glass-morphism rounded-2xl p-8"
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;