import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';
import InfoBox from '../../components/InfoBox/InfoBox';
import { ensureUserInDatabase } from '../../utils/userManagement';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle Google login and ensure user is in the database
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    // Sign in with Google popup
    try {
      const result = await signInWithPopup(auth, provider);
      const userStatus = await ensureUserInDatabase(result.user);
      // Redirect to homepage if user is new or existing 
      // Although this doesn't work as expected for some reason
      if (userStatus.success) {
        if (userStatus.isNewUser) {
          navigate('/homepage', { replace: true });
        } else {
          navigate('/homepage', { replace: true });
        }
      } else {
        alert('Failed to process user account. Please try again.');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container" role="main" aria-labelledby="login-title">
      <h2 id="login-title" className="login-title">Login</h2>
      <InfoBox 
        title="Welcome to EcoHabits!"
        description="We only offer login with Google at this time, sorry for the inconvenience!"
        italicDescription={true}
      />
      <button 
        className="google-button" 
        onClick={handleGoogleLogin} 
        disabled={isLoading}
        aria-label="Sign in with Google"
        aria-busy={isLoading}
      >
        {isLoading ? (
          'Signing in...'
        ) : (
          <>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
              alt="Google logo" 
              role="presentation"
            />
            Sign in with Google
          </>
        )}
      </button>
    </main>
  );
};

export default Login;
