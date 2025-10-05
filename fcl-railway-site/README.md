# Frtl Creative Labs - Railway Deployment

A full-stack e-commerce platform with crypto payments, built for Railway deployment.

## 🚀 Features

- **E-commerce Marketplace**: Product catalog, cart, checkout
- **Dual Payments**: Stripe (fiat) + Crypto (Coinbase/NOWPayments)
- **Unique Codes**: Blockchain-linked product codes
- **User Management**: Authentication, profiles, order history
- **Tech Initiatives**: Showcase of FCL's technological projects
- **Responsive Design**: Mobile-optimized interface
- **Real-time Updates**: Live cart and order status

## 🏗️ Tech Stack

### Backend
- **Node.js** with Express
- **PostgreSQL** with Prisma ORM
- **JWT** authentication
- **Stripe** for fiat payments
- **Coinbase Commerce** for crypto payments
- **Nodemailer** for email notifications

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **React Query** for data fetching
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling

### Deployment
- **Railway** for hosting
- **PostgreSQL** database
- **Environment variables** for configuration

## 📋 Prerequisites

- Node.js 18+ and npm
- Railway account
- Stripe account
- Coinbase Commerce account (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fcl-railway-site.git
cd fcl-railway-site
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fcl_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_51ABC123...
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...

# Crypto Payments
COINBASE_API_KEY=your_coinbase_api_key
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Database Setup

```bash
cd server
npx prisma migrate dev
npx prisma generate
npm run seed
```

### 5. Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

## 🚂 Railway Deployment

### 1. Connect to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose this repository

### 2. Environment Variables

Add these environment variables in Railway:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
COINBASE_API_KEY=your_coinbase_api_key
COINBASE_WEBHOOK_SECRET=your_coinbase_webhook_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REACT_APP_API_URL=https://your-app.railway.app/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Database

Railway will automatically provision a PostgreSQL database. The connection string will be available as `DATABASE_URL`.

### 4. Deploy

Railway will automatically deploy when you push to the main branch.

## 🔧 Configuration

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the dashboard
3. Set up webhooks pointing to `https://your-app.railway.app/api/payments/stripe/webhook`
4. Add the webhook secret to environment variables

### Coinbase Commerce Setup

1. Create a Coinbase Commerce account
2. Generate API keys
3. Set up webhooks pointing to `https://your-app.railway.app/api/payments/coinbase/webhook`
4. Add the webhook secret to environment variables

### Email Setup

1. Use Gmail with App Passwords
2. Enable 2-factor authentication
3. Generate an app password
4. Use the app password in `EMAIL_PASSWORD`

## 📁 Project Structure

```
fcl-railway-site/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   ├── prisma/             # Database schema
│   └── index.js            # Server entry point
├── package.json            # Root package.json
├── railway.json            # Railway configuration
└── README.md               # This file
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:sku` - Get product by SKU
- `GET /api/products/featured/list` - Get featured products

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Payments
- `POST /api/payments/stripe/create-payment-intent` - Create Stripe payment
- `POST /api/payments/coinbase/create-invoice` - Create Coinbase invoice
- `POST /api/payments/stripe/webhook` - Stripe webhook
- `POST /api/payments/coinbase/webhook` - Coinbase webhook

## 🔒 Security

- JWT authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
- Environment variable protection

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized forms
- Progressive Web App features

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` environment variable
   - Ensure PostgreSQL is running
   - Run database migrations

2. **Payment Issues**
   - Verify API keys are correct
   - Check webhook endpoints
   - Test in sandbox mode first

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Getting Help

- Check the [Railway Documentation](https://docs.railway.app)
- Review [Stripe Documentation](https://stripe.com/docs)
- Check [Coinbase Commerce Documentation](https://commerce.coinbase.com/docs)

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@frtlcreativelabs.com or create an issue on GitHub.

---

**Ready to deploy?** Follow the Railway deployment guide above to get your site live!
