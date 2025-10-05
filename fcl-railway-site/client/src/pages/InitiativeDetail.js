import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import api from '../services/api';

const InitiativeDetail = () => {
  const { slug } = useParams();

  const { data: initiative, isLoading, error } = useQuery(
    ['initiative', slug],
    () => api.get(`/initiatives/${slug}`).then(res => res.data.data),
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !initiative) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Initiative Not Found</h2>
          <p className="text-gray-600 mb-4">The initiative you're looking for doesn't exist.</p>
          <Link
            to="/initiatives"
            className="btn btn-primary"
          >
            Back to Initiatives
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link
            to="/initiatives"
            className="hover:text-blue-600 transition-colors"
          >
            Initiatives
          </Link>
          <span>/</span>
          <span className="text-gray-900">{initiative.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {initiative.heroImage && (
                <img
                  src={initiative.heroImage}
                  alt={initiative.title}
                  className="w-full h-64 object-cover"
                />
              )}
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  {initiative.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {initiative.status}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {initiative.title}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {initiative.summary}
                </p>
              </div>
            </motion.div>

            {/* Description */}
            {initiative.longDescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Initiative</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {initiative.longDescription}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {initiative.gallery && initiative.gallery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {initiative.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${initiative.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* External Documentation */}
            {initiative.externalDocsLink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documentation</h2>
                <p className="text-gray-600 mb-4">
                  For detailed technical documentation and implementation guides, visit our external documentation.
                </p>
                <a
                  href={initiative.externalDocsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center"
                >
                  View Documentation
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Initiative Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">
                      {new Date(initiative.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">{initiative.status}</p>
                  </div>
                </div>
                
                {initiative.featured && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-yellow-500">⭐</div>
                    <div>
                      <p className="text-sm text-gray-600">Featured</p>
                      <p className="font-medium text-gray-900">Yes</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Link
                  to="/initiatives"
                  className="btn btn-outline w-full mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Initiatives
                </Link>
                
                <Link
                  to="/products"
                  className="btn btn-primary w-full"
                >
                  View Related Products
                </Link>
              </div>

              {/* Contact CTA */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Interested in this initiative?</h4>
                <p className="text-sm text-blue-800 mb-4">
                  Get in touch with our team to learn more about implementation and collaboration opportunities.
                </p>
                <Link
                  to="/contact"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Contact Us →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeDetail;
