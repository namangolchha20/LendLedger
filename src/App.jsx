import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoanProvider } from './contexts/LoanContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Loans from './pages/Loans';
import LoanDetail from './pages/LoanDetail';
import Borrowers from './pages/Borrowers';
import BorrowerDetail from './pages/BorrowerDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <LoanProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="loans" element={<Loans />} />
                <Route path="loans/:id" element={<LoanDetail />} />
                <Route path="borrowers" element={<Borrowers />} />
                <Route path="borrowers/:id" element={<BorrowerDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </LoanProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
