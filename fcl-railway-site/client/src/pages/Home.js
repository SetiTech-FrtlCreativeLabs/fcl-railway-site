import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useQuery } from 'react-query';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import InitiativeCard from '../components/InitiativeCard';

const Home = () => {
  const { data: featuredProducts } = useQuery(
    'featuredProducts',
    () => api.get('/products/featured/list').then(res => res.data.data),
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: featuredInitiatives } = useQuery(
    'featuredInitiatives',
    () => api.get('/initiatives/featured').then(res => res.data.data),
    { staleTime: 5 * 60 * 1000 }
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Frtl Creative Labs
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              Innovation meets creativity in the future of technology
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/initiatives"
                className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center"
              >
                Explore Our Tech
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-blue-600 inline-flex items-center"
              >
                Visit Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Frtl Creative Labs?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're at the forefront of technological innovation, creating solutions that shape the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Cutting-Edge Innovation</h3>
              <p className="text-gray-600">
                We develop breakthrough technologies that push the boundaries of what's possible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Secure & Reliable</h3>
              <p className="text-gray-600">
                Our solutions are built with security and reliability as top priorities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-8 bg-white rounded-lg shadow-lg hover-lift"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Global Impact</h3>
              <p className="text-gray-600">
                Our technologies are designed to make a positive impact on a global scale.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Tech Initiatives */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Tech Initiatives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our latest technological breakthroughs and innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredInitiatives?.map((initiative, index) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <InitiativeCard initiative={initiative} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/initiatives"
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              View All Initiatives
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our latest products and solutions in our marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              Visit Marketplace
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter for the latest updates on our tech initiatives.
          </p>
          
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="btn bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
