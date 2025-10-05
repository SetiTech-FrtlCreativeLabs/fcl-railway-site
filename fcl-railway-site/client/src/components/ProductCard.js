import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift"
    >
      <Link to={`/products/${product.sku}`}>
        <div className="relative">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/products/${product.sku}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${(product.price / 100).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            SKU: {product.sku}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-sm px-2 py-1 rounded-full ${
              product.inventoryCount > 10
                ? 'bg-green-100 text-green-800'
                : product.inventoryCount > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inventoryCount > 10
                ? 'In Stock'
                : product.inventoryCount > 0
                ? `Only ${product.inventoryCount} left`
                : 'Out of Stock'
              }
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.inventoryCount === 0 || isInCart(product.sku)}
            className={`btn btn-sm ${
              product.inventoryCount === 0 || isInCart(product.sku)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart(product.sku) ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
