import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (sku, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(sku);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(sku, newQuantity);
    }
  };

  const handleRemoveItem = (sku, title) => {
    removeFromCart(sku);
    toast.success(`${title} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="btn btn-primary btn-lg inline-flex items-center"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.sku}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">SKU: {item.sku}</p>
                    <p className="text-xl font-bold text-blue-600">
                      ${(item.price / 100).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.sku, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.sku, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.sku, item.title)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${(getCartTotal() / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${(getCartTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg w-full mb-4"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <Link
                to="/products"
                className="btn btn-outline btn-lg w-full"
              >
                Continue Shopping
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
