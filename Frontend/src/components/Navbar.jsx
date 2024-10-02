import React from 'react';
import logo from '../assets/images/love-books.png';
import { Link } from 'react-router-dom';


const Navbar = ({ loggedIn, handleOpenModal, transparent, handleLogout }) => {
  return (

    <section className={`${transparent ? 'bg-transparent' : 'bg-[#182c25]'} w-full h-25 font-poppins`}>    {/**transparent when its the homepgae */}
      <nav className="flex items-center justify-between h-full px-4 py-2 ">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={logo} alt="bookicon" className="h-14 w-auto" />
          </Link>
          <ul className="flex space-x-6 text-white text-2xl">
            <li>
              <Link
                to="/search"
                // animation for underline
                className="relative text-white hover:text-[#1E4A1C] transition-colors duration-700 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#1E4A1C] after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-700"
              >
                Browse
              </Link>
            </li>
            <li>
              <Link
                to="/matcher"
                className="relative text-white hover:text-[#1E4A1C] transition-colors duration-700 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#1E4A1C] after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-700"
              >
                Matcher
              </Link>
            </li>
            <li>
              <Link
                to="/myBooks"
                className="relative text-white hover:text-[#1E4A1C] transition-colors duration-700 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#1E4A1C] after:scale-x-0 after:origin-center hover:after:scale-x-100 after:transition-transform after:duration-700"
              >
                My Books
              </Link>
            </li>
          </ul>
        </div>
        <div>
          {loggedIn ? (
            <>
            <Link
              to="/profile"
              className="bg-[#1E4A1C] text-white py-2 px-5 rounded-full text-xl shadow-lg hover:bg-[#245922] focus:outline-none"
            >
              Profile
            </Link>
             <button
             onClick={handleLogout} // Trigger logout dont need arrow since the function has no ()
             className="ml-4 bg-red-500 text-white py-2 px-5 rounded-full text-xl shadow-lg hover:bg-red-600 focus:outline-none"
           >
             Log Out
           </button>
          </>
          ) : (
            <button
              onClick={() => handleOpenModal(true)} 
              //arrow function (() => handleOpenModal(true)) ensures that the function handleOpenModal(true) is only executed when the click event occurs?
              className="bg-[#1E4A1C] text-white py-2 px-5 rounded-full text-xl shadow-lg hover:bg-[#245922] focus:outline-none"
            >
              Log In
            </button>
          )}
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
