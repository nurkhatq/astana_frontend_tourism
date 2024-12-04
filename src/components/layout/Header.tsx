import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Astana Tourism</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/places"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${location.pathname === '/places' 
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
              >
                Places
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <img
                    src={user?.avatar || 'https://avatars.mds.yandex.net/i?id=6941e2e18fcce6f94a9aec6ffd1c0aa6_l-8497209-images-thumbs&n=13'}
                    alt={'https://avatars.mds.yandex.net/i?id=6941e2e18fcce6f94a9aec6ffd1c0aa6_l-8497209-images-thumbs&n=13'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user?.first_name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};