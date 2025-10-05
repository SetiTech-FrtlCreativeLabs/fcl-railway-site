import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="btn btn-primary btn-lg w-full inline-flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline btn-lg w-full inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            
            <Link
              to="/products"
              className="btn btn-outline btn-lg w-full inline-flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
