import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const ProductDetail = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery(
    ['product', sku],
    () => api.get(`/products/${sku}`).then(res => res.data.data),
    { enabled: !!sku }
  );

  const handleAddToCart = () => {
    if (product.inventoryCount === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product, quantity);
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (product.inventoryCount === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product, quantity);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || ['/placeholder-product.jpg'];
  const isInCart = isInCart(product.sku);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate('/products')}
            className="hover:text-blue-600 transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${(product.price / 100).toFixed(2)}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>SKU: {product.sku}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.8 (24 reviews)</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.metadata?.features && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.metadata.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventoryCount, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventoryCount === 0 || isInCart}
                  className={`btn btn-lg flex-1 ${
                    product.inventoryCount === 0 || isInCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? 'In Cart' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  disabled={product.inventoryCount === 0}
                  className={`btn btn-lg flex-1 ${
                    product.inventoryCount === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-secondary'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.inventoryCount > 10
                    ? 'bg-green-500'
                    : product.inventoryCount > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}></div>
                <span className="font-medium">
                  {product.inventoryCount > 10
                    ? 'In Stock'
                    : product.inventoryCount > 0
                    ? `Only ${product.inventoryCount} left`
                    : 'Out of Stock'
                  }
                </span>
              </div>
              
              {product.cryptoEnabled && (
                <p className="text-sm text-gray-600">
                  💳 Accepts both fiat and cryptocurrency payments
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* This would be populated with related products */}
            <div className="text-center py-8 text-gray-500">
              Related products would be loaded here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
