import './TopBar.css';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
// this component is a header that displays burger menu, the app name and user profile button on all pages
const TopBar: React.FC = () => {
  return (
    <header className="top-bar" role="banner">
      <div className="nav-wrapper">
        <BurgerMenu aria-label="Main menu" />
      </div>
      <h1 className="app-name">
        EcoHabits
      </h1>
      <button 
        className="user-profile-button"
        aria-label="User profile"
      >
        <i className="fas fa-user-circle" aria-hidden="true"></i>
      </button>
    </header>
  );
};

export default TopBar;