import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, Check, Star, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const BuyCredits = () => {
  const [credits, setCredits] = useState(1);
  const [loading, setLoading] = useState(false);

  const creditPacks = [
    {
      credits: 1,
      price: 97,
      popular: false,
      description: 'Perfect for a single analysis'
    },
    {
      credits: 3,
      price: 270,
      popular: true,
      description: 'Best value for regular monitoring',
      discount: 'Save $21'
    },
    {
      credits: 5,
      price: 435,
      popular: false,
      description: 'Ideal for multiple pets',
      discount: 'Save $50'
    }
  ];

  const features = [
    'AI-powered blood test analysis',
    'Instant results and interpretation',
    'Interactive chat with AI',
    'Downloadable PDF reports',
    'Email notifications',
    'Secure data handling'
  ];

  const handlePurchase = async (selectedCredits) => {
    setLoading(true);
    try {
      const hostUrl = window.location.origin;
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          credits: selectedCredits,
          host_url: hostUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast.error('Failed to create payment session');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      {/* Background Elements */}
      <div className="fixed inset-0 cyber-grid-bg opacity-20"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/10 via-transparent to-secondary-50/10 dark:from-primary-950/10 dark:to-secondary-950/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6 neon-glow">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Buy Analysis Credits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get professional veterinary blood test analysis powered by AI. 
            Each credit gives you one complete analysis report.
          </p>
        </motion.div>

        {/* Credit Packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {creditPacks.map((pack, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`glass-morphism rounded-2xl p-8 relative ${
                pack.popular 
                  ? 'ring-2 ring-primary-500 shadow-xl scale-105' 
                  : 'hover:shadow-lg'
              } transition-all duration-300`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {pack.credits} Credit{pack.credits > 1 ? 's' : ''}
                </div>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ${pack.price}
                </div>
                {pack.discount && (
                  <div className="text-green-600 dark:text-green-400 font-medium text-sm">
                    {pack.discount}
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {pack.description}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>{pack.credits} AI analysis report{pack.credits > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Detailed PDF report{pack.credits > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Interactive chat</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email notifications</span>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pack.credits)}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  pack.popular
                    ? 'cyber-button'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400'
                }`}
              >
                {loading ? (
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  `Buy ${pack.credits} Credit${pack.credits > 1 ? 's' : ''}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What You Get With Every Credit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Stripe Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Instant Access</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Your payment information is secure and encrypted. Credits are added to your account immediately.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyCredits;