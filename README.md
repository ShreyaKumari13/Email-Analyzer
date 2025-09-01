# 📧 Email Analyzer - Lucid Growth Assignment

A comprehensive full-stack application that automatically identifies email receiving chains and ESP (Email Service Provider) types using IMAP analysis.

## 🚀 Features

- **Real-time IMAP Email Processing**: Automatically detects and processes incoming emails
- **Receiving Chain Analysis**: Traces the complete path emails travel through servers
- **ESP Detection**: Identifies email service providers with confidence scoring
- **Responsive UI**: Clean, mobile-friendly interface built with Next.js and Tailwind CSS
- **Visual Timeline**: Interactive visualization of email routing paths
- **Real-time Updates**: Live polling for new email analysis results

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for responsive styling
- **Lucide React** icons
- **Axios** for API calls

### Backend
- **NestJS** framework with TypeScript
- **IMAP** integration for email processing
- **MongoDB** for data persistence
- **Mongoose** ODM

### DevOps
- **Vercel** deployment ready
- **Docker** support (optional)

## 📋 Prerequisites

- Node.js (v18 or later)
- MongoDB (local or cloud instance)
- Email account with IMAP access

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd email-analyzer
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/email-analyzer
NODE_ENV=development

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true

# Frontend URL for CORS
FRONTEND_URL=https://email-analyzer-ivory.vercel.app
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=https://email-analyzer-6g1h.onrender.com" > .env.local
```

### 4. Database Setup

Ensure MongoDB is running locally or provide a cloud MongoDB URI in your `.env` file.

## 🚦 Running the Application

### Development Mode

**Start Backend:**
```bash
cd backend
npm run start:dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000` or the deployed version at https://email-analyzer-ivory.vercel.app

### Production Mode

**Build Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Build Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 📧 How to Test

1. **Access the Application**: Navigate to `http://localhost:3000` or the deployed version at https://email-analyzer-ivory.vercel.app

2. **Get Test Email Address**: The system displays a generated email address and subject line

3. **Send Test Email**: Send an email from any ESP (Gmail, Outlook, etc.) to the displayed address with the exact subject line

4. **View Results**: The system automatically processes the email and displays:
   - ESP type with confidence score
   - Complete receiving chain visualization
   - Technical details and headers

## 🔍 Supported ESP Providers

The system can detect and identify:

- **Gmail/Google** - Google's email service
- **Outlook/Hotmail** - Microsoft's email services
- **Amazon SES** - Amazon Simple Email Service
- **SendGrid** - Email delivery service
- **Mailgun** - Email automation service
- **Yahoo Mail** - Yahoo's email service
- **Zoho Mail** - Zoho's email service
- **Mailchimp** - Email marketing platform
- **Generic ESPs** - Pattern-based detection for other providers

## 📊 API Endpoints

### Email Configuration
- `GET /api/emails/config` - Get test email configuration
- `GET /api/emails/status` - Get IMAP connection status

### Email Analysis
- `GET /api/emails` - Get all processed emails
- `GET /api/emails/latest` - Get latest processed email
- `GET /api/emails/:id` - Get specific email by ID

## 🏗 Architecture

### Backend Structure
```
backend/src/
├── modules/
│   └── email/
│       ├── email.controller.ts
│       ├── email.service.ts
│       └── email.module.ts
├── schemas/
│   └── email.schema.ts
├── interfaces/
│   └── email.interface.ts
├── utils/
│   ├── header-parser.ts
│   └── esp-detector.ts
├── main.ts
└── app.module.ts
```

### Frontend Structure
```
frontend/src/
├── app/
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── EmailConfig.tsx
│   ├── EmailAnalysis.tsx
│   ├── ReceivingChainTimeline.tsx
│   └── ESPBadge.tsx
├── services/
│   └── emailService.ts
└── types/
    └── email.ts
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel

2. **Configure Environment Variables**:
   ```env
   MONGODB_URI=your-mongodb-cloud-uri
   IMAP_HOST=your-imap-host
   IMAP_USER=your-email
   IMAP_PASSWORD=your-password
   NEXT_PUBLIC_API_URL=https://email-analyzer-6g1h.onrender.com
   ```

3. **Deploy**: Vercel will automatically build and deploy both frontend and backend

### Alternative Deployment Options

- **Frontend**: Netlify, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean, AWS

## 🔐 Security Considerations

- **Environment Variables**: Never commit sensitive credentials
- **IMAP Credentials**: Use app-specific passwords when available
- **CORS Configuration**: Properly configured for your domains
- **Input Validation**: All API inputs are validated
- **Rate Limiting**: Consider implementing rate limiting for production

## 🧪 Testing

### Manual Testing Steps

1. Set up the application with valid IMAP credentials
2. Send test emails from different ESP providers
3. Verify receiving chain parsing accuracy
4. Confirm ESP detection confidence scores
5. Test UI responsiveness on different devices

### Automated Testing (Future Enhancement)

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🐛 Troubleshooting

### Common Issues

**IMAP Connection Failed**:
- Verify IMAP credentials and server settings
- Enable "Less secure app access" or use app passwords
- Check firewall/network restrictions

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Verify connection string format
- Check network connectivity for cloud instances

**Build Failures**:
- Clear node_modules and reinstall dependencies
- Verify Node.js version compatibility
- Check for TypeScript compilation errors

## 📈 Performance Optimization

- **Email Processing**: Optimized header parsing with caching
- **Database Queries**: Indexed MongoDB collections
- **Frontend**: Lazy loading and component optimization
- **Real-time Updates**: Efficient polling strategy
