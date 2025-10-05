import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Coins, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    billingInfo: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    },
    shippingInfo: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    },
    sameAsBilling: true
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSameAsBillingChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      sameAsBilling: checked,
      shippingInfo: checked ? prev.billingInfo : prev.shippingInfo
    }));
  };

  const validateForm = () => {
    const { billingInfo, shippingInfo } = formData;
    
    if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email || 
        !billingInfo.address || !billingInfo.city || !billingInfo.state || !billingInfo.zip) {
      toast.error('Please fill in all required billing information');
      return false;
    }
    
    if (!formData.sameAsBilling) {
      if (!shippingInfo.firstName || !shippingInfo.lastName || 
          !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.zip) {
        toast.error('Please fill in all required shipping information');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Create order
      const orderData = {
        items: cartItems,
        total: getCartTotal() / 100, // Convert to dollars
        billingInfo: formData.billingInfo,
        shippingInfo: formData.sameAsBilling ? formData.billingInfo : formData.shippingInfo,
        paymentMethod
      };
      
      // Simulate order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect
      clearCart();
      navigate('/order-confirmation/123');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-4"
                  />
                  <Coins className="w-5 h-5 mr-3 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Cryptocurrency</div>
                    <div className="text-sm text-gray-600">Bitcoin, Ethereum, and other crypto</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.firstName}
                    onChange={(e) => handleInputChange('billingInfo', 'firstName', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.lastName}
                    onChange={(e) => handleInputChange('billingInfo', 'lastName', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.billingInfo.email}
                    onChange={(e) => handleInputChange('billingInfo', 'email', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.billingInfo.phone}
                    onChange={(e) => handleInputChange('billingInfo', 'phone', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.address}
                    onChange={(e) => handleInputChange('billingInfo', 'address', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.city}
                    onChange={(e) => handleInputChange('billingInfo', 'city', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.state}
                    onChange={(e) => handleInputChange('billingInfo', 'state', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.billingInfo.zip}
                    onChange={(e) => handleInputChange('billingInfo', 'zip', e.target.value)}
                    className="input w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    value={formData.billingInfo.country}
                    onChange={(e) => handleInputChange('billingInfo', 'country', e.target.value)}
                    className="input w-full"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.sameAsBilling}
                    onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Same as billing</span>
                </label>
              </div>
              
              {!formData.sameAsBilling && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.firstName}
                      onChange={(e) => handleInputChange('shippingInfo', 'firstName', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.lastName}
                      onChange={(e) => handleInputChange('shippingInfo', 'lastName', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.address}
                      onChange={(e) => handleInputChange('shippingInfo', 'address', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.city}
                      onChange={(e) => handleInputChange('shippingInfo', 'city', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.state}
                      onChange={(e) => handleInputChange('shippingInfo', 'state', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shippingInfo.zip}
                      onChange={(e) => handleInputChange('shippingInfo', 'zip', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      value={formData.shippingInfo.country}
                      onChange={(e) => handleInputChange('shippingInfo', 'country', e.target.value)}
                      className="input w-full"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.sku} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
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
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${(getCartTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-primary btn-lg w-full mt-6"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Order
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
