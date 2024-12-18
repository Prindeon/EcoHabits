import React, { useState } from 'react';
import './BurgerMenu.css';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

// Create a BurgerMenu component that displays a button to open a nav menu
const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Function to log out
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsOpen(!isOpen);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
        <button 
          className="burger-menu" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Main Menu"
          aria-controls="navigation-menu"
        >
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`burger-bar ${isOpen ? 'open' : ''}`}></div>
        </button>
      <nav 
        id="navigation-menu" 
        className={`menu-items ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <Link to="/homepage" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/challenges" onClick={() => setIsOpen(false)}>Challenges</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About EcoHabits</Link>
        <button className='logout-btn' onClick={handleLogout}>Log out</button>
      </nav>
    </>
  );
};

export default BurgerMenu;