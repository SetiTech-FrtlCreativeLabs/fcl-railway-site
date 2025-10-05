import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import InitiativeCard from '../components/InitiativeCard';

const Initiatives = () => {
  const [filters, setFilters] = useState({
    search: '',
    featured: '',
    sortBy: 'order',
    sortOrder: 'asc',
    page: 1
  });

  const [viewMode, setViewMode] = useState('grid');

  const { data: initiativesData, isLoading, error } = useQuery(
    ['initiatives', filters],
    () => api.get('/initiatives', { params: filters }).then(res => res.data),
    { keepPreviousData: true }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filter change
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Initiatives</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Initiatives</h1>
          <p className="text-xl text-gray-600">
            Explore our cutting-edge technological projects and innovations
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search initiatives..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Initiatives</option>
                <option value="true">Featured Only</option>
              </select>

              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="order-asc">Default Order</option>
                <option value="title-asc">Name A-Z</option>
                <option value="title-desc">Name Z-A</option>
                <option value="createdAt-desc">Newest First</option>
              </select>
            </div>
          </form>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {initiativesData && (
              <p className="text-sm text-gray-600">
                Showing {initiativesData.data.length} of {initiativesData.pagination.total} initiatives
              </p>
            )}
          </div>
        </div>

        {/* Initiatives Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : initiativesData?.data.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {initiativesData.data.map((initiative, index) => (
              <motion.div
                key={initiative.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <InitiativeCard initiative={initiative} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No initiatives found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {initiativesData?.pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(initiativesData.pagination.pages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handleFilterChange('page', index + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    filters.page === index + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page === initiativesData.pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Initiatives;
