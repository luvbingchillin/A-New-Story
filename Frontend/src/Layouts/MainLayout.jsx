import { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Background from '../assets/images/book.jpg'; // Ensure this is properly imported
import SignUpModal from '../components/SignUpModal';
import { AuthContext } from '../Context/AuthContext';

const MainLayout = ({ handleOpenModal, showModal, handleCloseModal, isLoginMode }) => {
  const { loggedIn, handleLogout, setLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Loading state to check if the background image is loaded
  const [isLoading, setIsLoading] = useState(true);

  // Handle background image loading
  useEffect(() => {
    const img = new Image();
    img.src = Background;
    img.onload = () => {
      setIsLoading(false); // Set loading to false when the image is loaded
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        // Show a loading spinner or placeholder while the background image is loading
        <div className="min-h-screen flex justify-center items-center bg-black">
          <p className="text-white text-xl">Loading...</p>
        </div>
      ) : (
        <div
          className={`min-h-screen ${isHomePage ? 'bg-cover bg-center' : ''} overflow-y-scroll`}
          style={
            isHomePage
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.01)), url(${Background})`,
                  backgroundAttachment: 'fixed',
                }
              : {}
          }
        >
          <Navbar
            loggedIn={loggedIn}
            handleOpenModal={handleOpenModal}
            transparent={isHomePage}
            handleLogout={handleLogout}
          />
          <Outlet />
          {/* Initial render of signup modal */}
          <SignUpModal
            show={showModal}
            handleClose={handleCloseModal}
            isLoginMode={isLoginMode}
            setLoggedIn={setLoggedIn}
          />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
