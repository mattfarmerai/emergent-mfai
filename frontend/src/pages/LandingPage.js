import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Upload, 
  Brain, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle,
  FileText,
  MessageSquare,
  CreditCard,
  Target,
  Sparkles,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroImages = [
    'https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwwfHx8Ymx1ZXwxNzUyODUxNDkyfDA&ixlib=rb-4.1.0&q=85',
    'https://images.pexels.com/photos/2422556/pexels-photo-2422556.jpeg',
    'https://images.pexels.com/photos/8532850/pexels-photo-8532850.jpeg'
  ];

  const features = [
    {
      icon: Upload,
      title: 'Easy PDF Upload',
      description: 'Simply upload your dog\'s blood test PDF and our AI will extract and analyze all the data automatically.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI interprets blood test results with veterinary expertise, identifying abnormalities and their significance.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Ask questions about your dog\'s results and get instant, detailed explanations in easy-to-understand language.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description: 'Download detailed PDF reports that you can share with your veterinarian for further consultation.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get your blood test analysis in minutes, not days. Perfect for urgent health concerns.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your pet\'s health data is encrypted and secure. We never share your information with third parties.',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Dog Owner',
      content: 'DogBloodGPT helped me understand my Golden Retriever\'s blood work before our vet appointment. The AI analysis was spot-on and gave me confidence to ask the right questions.',
      rating: 5,
      avatar: '🐕'
    },
    {
      name: 'Mike Chen',
      role: 'Pet Parent',
      content: 'Amazing service! The detailed report helped me catch early signs of kidney issues in my German Shepherd. The $97 per analysis is worth every penny for peace of mind.',
      rating: 5,
      avatar: '🐺'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Veterinary Technician',
      content: 'Even as a vet tech, I find DogBloodGPT incredibly useful for explaining complex results to pet owners. The AI explanations are accurate and easy to understand.',
      rating: 5,
      avatar: '🐾'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your PDF',
      description: 'Upload your dog\'s blood test results in PDF format',
      icon: Upload
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes every parameter and identifies issues',
      icon: Brain
    },
    {
      number: '03',
      title: 'Get Results',
      description: 'Receive detailed analysis, chat with AI, and download reports',
      icon: FileText
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 cyber-grid-bg opacity-50"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-secondary-50/20 dark:from-primary-950/20 dark:to-secondary-950/20"></div>
      
      {/* Floating Particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Veterinary Analysis
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="block text-gray-900 dark:text-white">
                  Understand Your
                </span>
                <span className="block bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 bg-clip-text text-transparent holographic">
                  Dog's Blood Tests
                </span>
                <span className="block text-gray-900 dark:text-white">
                  Instantly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                Upload your dog's blood test results and get expert AI analysis in minutes. 
                Understand what the numbers mean, identify potential issues, and get actionable insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="cyber-button group"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="cyber-button group"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                
                <Link
                  to="/buy-credits"
                  className="px-8 py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  $97 per Analysis
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant Results
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  AI-Powered Analysis
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Veterinary Expertise
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Images */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="glass-morphism rounded-2xl overflow-hidden floating-animation">
                    <img
                      src={heroImages[0]}
                      alt="Medical Technology"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="glass-morphism rounded-2xl overflow-hidden floating-animation" style={{ animationDelay: '1s' }}>
                    <img
                      src={heroImages[1]}
                      alt="AI Analysis"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="glass-morphism rounded-2xl overflow-hidden floating-animation" style={{ animationDelay: '2s' }}>
                    <img
                      src={heroImages[2]}
                      alt="Lab Technology"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Analysis Complete
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                  98.7% Accuracy
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get professional blood test analysis in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="glass-morphism rounded-2xl p-8 h-full">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 neon-glow">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to understand your dog's health
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Pet Parents Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust DogBloodGPT
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-morphism rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">
                {testimonials[currentTestimonial].avatar}
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-primary-500 scale-125' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Understand Your Dog's Health?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of pet parents who use DogBloodGPT to monitor their dog's health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/upload"
                  className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Blood Test
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
                >
                  Start Free Account
                </Link>
              )}
              <Link
                to="/buy-credits"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-300 flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Buy Analysis Credits
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;