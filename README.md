# 💎 LendLedger

### Smart Lending. Zero Chaos.
LendLedger is a premium Fintech SaaS platform designed to bring professional-grade management to informal lending. Track, validate, and recover loans with absolute confidence using our data-driven insights and trust-based validation protocols.

![LendLedger Banner](./lendledger_banner_1776706137397.png)

## ✨ Core Features

### 📊 Intelligence Dashboard
Get a high-level overview of your lending ecosystem. Real-time KPIs including Total Lent, Outstanding Exposure, and Risk Analytics at your fingertips.

### 👥 Borrower Directory & Risk Scoring
Maintain a comprehensive database of borrowers. Our smart risk engine assigns trust scores based on repayment history, confirmation rates, and active delinquencies.

### 💰 Precision Loan Management
Complete CRUD operations for loans with detailed tracking.
- **Verification Assets**: Upload proof of transaction (images/PDFs).
- **Automated Reminders**: Direct-to-WhatsApp communication for seamless follow-ups.
- **Smart Status Tracking**: Real-time status updates (Paid, Overdue, Due Soon).

### 🌓 Premium Theme System
Full parity between Light and Dark modes. A stunning, glassmorphic UI built for professional data density without the clutter.

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite (Ultra-fast HMR)
- **Styling**: Tailwind CSS + Custom Design Token System
- **Backend/DB**: Firebase (Firestore, Authentication, Storage)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Firebase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LendLedger.git
   cd LendLedger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

## 📐 Architecture
LendLedger follows a connection-first UX architecture, leveraging React Context API for global state management and Firebase for real-time synchronization.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<<<<<<< HEAD
Built with ❤️ for better financial clarity.
=======
Built with ❤️ for better financial clarity.
>>>>>>> efe5013 (fix)
