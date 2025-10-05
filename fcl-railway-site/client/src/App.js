import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import Initiatives from './pages/Initiatives';
import InitiativeDetail from './pages/InitiativeDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:sku" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/initiatives" element={<Initiatives />} />
              <Route path="/initiatives/:slug" element={<InitiativeDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
