// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { QueryProvider } from './providers/QueryProvider';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/Home';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { PlacesPage } from './pages/Places';
import { PlaceDetailPage } from './pages/PlaceDetail';
import { ProfilePage } from './pages/Profile';
import { UserProfilePage } from './pages/UserProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <Router>
      <QueryProvider>
        <AuthProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/places" element={<PlacesPage />} />
                  <Route path="/places/:id" element={<PlaceDetailPage />} />
                  <Route path="/users/:id" element={<UserProfilePage />} />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
            <Toaster position="top-right" />
          </FavoritesProvider>
        </AuthProvider>
      </QueryProvider>
    </Router>
  );
}