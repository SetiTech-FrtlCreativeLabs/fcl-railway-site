import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Print, Share2, QrCode } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  
  // Mock order data - in real app, this would come from API
  const order = {
    id: id || '123',
    orderNumber: 'FCL-20241205-ABC123',
    status: 'paid',
    total: 29999, // $299.99 in cents
    currency: 'USD',
    uniqueCode: 'FCL-20241205-XYZ789',
    blockchainTxId: '0x1234567890abcdef',
    createdAt: new Date().toISOString(),
    items: [
      {
        sku: 'QCS-001',
        title: 'Quantum Computing Starter Kit',
        price: 29999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1635070041078-e43c8c05a5e1?w=200&h=200&fit=crop'
      }
    ],
    billingInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'Tech City',
      state: 'TC',
      zip: '12345'
    },
    shippingInfo: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Tech City',
      state: 'TC',
      zip: '12345'
    }
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt...');
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation',
        text: `Order ${order.orderNumber} from Frtl Creative Labs`,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="btn btn-outline btn-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Receipt
                  </button>
                  <button
                    onClick={handlePrintOrder}
                    className="btn btn-outline btn-sm"
                  >
                    <Print className="w-4 h-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={handleShareOrder}
                    className="btn btn-outline btn-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600 capitalize">{order.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-lg">
                        ${(order.total / 100).toFixed(2)} {order.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
                    <p>{order.billingInfo.email}</p>
                    <p>{order.billingInfo.address}</p>
                    <p>{order.billingInfo.city}, {order.billingInfo.state} {order.billingInfo.zip}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.sku} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Unique Code */}
            {order.uniqueCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Unique Product Code</h2>
                
                <div className="text-center">
                  <div className="inline-block p-6 bg-gray-50 rounded-lg mb-4">
                    <QrCode className="w-32 h-32 mx-auto text-gray-600" />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Your unique product code:</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono">
                        {order.uniqueCode}
                      </p>
                    </div>
                    
                    {order.blockchainTxId && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Blockchain Transaction:</p>
                        <a
                          href={`https://etherscan.io/tx/${order.blockchainTxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-mono break-all"
                        >
                          {order.blockchainTxId}
                        </a>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                      This unique code is linked to your purchase on the blockchain and can be used to verify authenticity.
                    </p>
                  </div>
                </div>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Processing</h3>
                    <p className="text-sm text-gray-600">
                      We'll process your order and prepare it for shipment.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping</h3>
                    <p className="text-sm text-gray-600">
                      You'll receive tracking information via email.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Your order will arrive within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  to="/account"
                  className="btn btn-primary w-full"
                >
                  View Order History
                </Link>
                
                <Link
                  to="/products"
                  className="btn btn-outline w-full"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800">
                  If you have any questions about your order, please contact our support team.
                </p>
                <Link
                  to="/contact"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
