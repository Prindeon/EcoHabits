import './App.css'
import HomePage from './pages/HomePage/HomePage'
import './FirebaseConfig'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import TopBar from './components/TopBar/TopBar';
import Challenges from './pages/Challenges/Challenges';
import About from './pages/About/About';
import Stats from './pages/Stats/Stats';

// Add ProtectedRoute component which makes sure that the user is logged in before rendering the children
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <TopBar />
          <main>
            <Routes>
                <Route path="/stats" element={<Stats />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/homepage" element={
                  <ProtectedRoute>
                    <>
                      <HomePage />
                    </>
                  </ProtectedRoute>
                } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
