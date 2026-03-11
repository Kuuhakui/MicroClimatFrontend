import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RoomMap from './pages/RoomMap';
import Analytics from './pages/Analytics';
import EventsJournal from './pages/EventsJournal';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import AuthLayout from './layouts/AuthLayout'; // Твой текущий AuthLayout (Login)
import RegisterLayout from './layouts/RegisterLayout'; // Созданный ранее компонент регистрации
import './index.css';

const queryClient = new QueryClient();
const AUTH_API = 'http://localhost:8000/auth';

// --- Логика авторизации ---
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Данные: {id, username, role}
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    } catch (err) {
      console.error("Auth verify error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return { user, loading, logout: () => {
    localStorage.removeItem('authToken');
    setUser(null);
  }};
};

// --- Защищенный роут ---
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user, loading, logout } = useAuth();

  // Твой WebSocket Mock (оставляем без изменений)
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const ws = new WebSocket('ws://localhost:8080/ws');
      ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'sensors' }));
      ws.onmessage = (event) => console.log('WS Update:', JSON.parse(event.data));
      return () => ws.close();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600 font-medium">Проверка сессии...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Публичные роуты */}
            <Route path="/login" element={!user ? <AuthLayout /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterLayout /> : <Navigate to="/" />} />
            
            {/* Защищенные роуты */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute user={user}>
                  <MainLayout user={user} logout={logout} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="map" element={<RoomMap />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="events" element={<EventsJournal />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Редирект для всех остальных путей */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;