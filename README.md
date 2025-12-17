# 💰 FinVoice.AI - AI-Powered Financial Management

> Smart financial tracking with voice assistance and AI insights

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-url.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Features

### Core Features
- 📊 **Dashboard** - Real-time financial overview
- 💸 **Transaction Management** - Track income and expenses
- 📈 **Balance Sheet** - Comprehensive financial reports
- ⚠️ **Payable Alerts** - Never miss a payment
- 👤 **Profile Management** - Customize your experience

### AI-Powered Features
- 🎤 **Voice Assistant** - Add transactions by voice
- 🤖 **AI Insights** - Smart spending analysis
- 📊 **Predictions** - Forecast future expenses
- 💡 **Recommendations** - Personalized financial advice

### Premium Features
- 💎 **Subscription Plans** - Free, Monthly, Quarterly, Yearly
- 📥 **Export Reports** - PDF and Excel downloads
- 🔔 **Smart Notifications** - Real-time alerts
- 🌍 **Multi-Currency** - Support for multiple currencies

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finvoice-ai.git
   cd finvoice-ai
   ```

2. **Setup Backend**
   ```bash
   cd finvoice-backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd finvoice-frontend
   npm install
   cp .env.example .env
   # Edit .env with your backend URL
   npm start
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
finvoice-ai/
├── finvoice-backend/          # Node.js + Express backend
│   ├── config/                # Database configuration
│   ├── middlewares/           # Auth, rate limiting, validation
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   └── server.js              # Entry point
│
├── finvoice-frontend/         # React frontend
│   ├── public/                # Static files
│   └── src/
│       ├── components/        # React components
│       ├── hooks/             # Custom hooks
│       ├── utils/             # Utility functions
│       └── App.js             # Main app component
│
└── docs/                      # Documentation
```

## 🔧 Configuration

### Backend Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/finvoice
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/change-password` - Change password

### Subscription
- `GET /api/subscription/usage` - Get usage stats
- `POST /api/subscription/upgrade` - Upgrade plan

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
cd finvoice-frontend
npm install -g vercel
vercel --prod
```

### Deploy to Render (Backend)
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy!

### MongoDB Atlas Setup
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Add to backend .env

## 📊 Tech Stack

### Frontend
- React 18
- CSS3 (Custom styling)
- Axios (API calls)
- React Hooks

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (Password hashing)

### DevOps
- Git & GitHub
- Vercel (Frontend hosting)
- Render (Backend hosting)
- MongoDB Atlas (Database)

## 🎨 Design System

### Colors
- Navy: `#1B263B`
- Teal: `#71C7B8`
- Soft Green: `#A8DADC`
- Off White: `#F7F9FA`

### Typography
- Font: Inter, system fonts

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ Security headers
- ✅ XSS protection

## 📈 Subscription Plans

| Plan | Price | Transactions | Features |
|------|-------|--------------|----------|
| Free | ₹0 | 50/month | Basic features |
| Monthly | ₹149 | 150/month | Reports + Alerts |
| Quarterly | ₹399 | 550/3mo | + AI Voice |
| Yearly | ₹1499 | Unlimited | All features + 1 month free |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Icons from emoji
- Design inspiration from modern fintech apps
- Community feedback and contributions

## 📞 Support

For support, email support@finvoice.ai or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Tax preparation tools
- [ ] Multi-user accounts
- [ ] Advanced analytics
- [ ] API for developers

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Transactions
![Transactions](docs/screenshots/transactions.png)

### Profile
![Profile](docs/screenshots/profile.png)

---

Made with ❤️ by [Your Name]
