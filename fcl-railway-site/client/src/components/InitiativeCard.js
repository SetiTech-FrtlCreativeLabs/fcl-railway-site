import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const InitiativeCard = ({ initiative }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift"
    >
      <Link to={`/initiatives/${initiative.slug}`}>
        <div className="relative">
          <img
            src={initiative.heroImage || '/placeholder-initiative.jpg'}
            alt={initiative.title}
            className="w-full h-48 object-cover"
          />
          {initiative.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/initiatives/${initiative.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
            {initiative.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {initiative.summary}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/initiatives/${initiative.slug}`}
            className="btn btn-outline btn-sm inline-flex items-center"
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          {initiative.externalDocsLink && (
            <a
              href={initiative.externalDocsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InitiativeCard;
