// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { assignDefaultTasks } from '../utils/taskAssignment';
import { ensureUserInDatabase } from '../utils/userManagement';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create context with default values for user and loading state
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// Auth provider component so that the app has access to the user and loading state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in and assign default tasks
  useEffect(() => {
    const auth = getAuth();
    // Set up Firebase auth state listener to update user state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserInDatabase(user);
        await assignDefaultTasks(user.uid);
      }
      setUser(user);
      setLoading(false);
    });
    // Unsubscribe from the listener
    return unsubscribe;
  }, []);

  // Provide user and loading state to the app
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};