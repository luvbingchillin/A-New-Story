import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Background from '../assets/images/book.jpg';
import SignUpModal from '../components/SignUpModal';

const MainLayout = ({ loggedIn, handleOpenModal, showModal, handleCloseModal, isLoginMode, handleLogout, setLoggedIn }) => {
  /// store current webpage location to determine which background image to be used 
  const location = useLocation();
  const isHomePage = location.pathname === '/'; 


  return (
    <div
      // className can used be used for classes, can aplly ccs properties through tailwind with predefined classes
      className={`min-h-screen ${isHomePage ? 'bg-cover bg-center' : ''} overflow-y-scroll`}
      // style is used to apply ccs properties in-line
      style={isHomePage ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.01)), url(${Background})`,
        backgroundAttachment: 'fixed',
      } : {}}
    >
 
      <Navbar loggedIn={loggedIn} handleOpenModal={handleOpenModal} transparent={isHomePage} handleLogout={handleLogout}/>
      <Outlet />
      {/* inital render of signup modal*/}
      <SignUpModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        isLoginMode={isLoginMode}
        setLoggedIn = { setLoggedIn} 
      />

    </div>
  );
};

export default MainLayout;
