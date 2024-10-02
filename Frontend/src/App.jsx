import { useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './Layouts/MainLayout';
import BookSearch from './pages/BookSearch';
import NotFound from './pages/NotFound';
import Matcher from './pages/Matcher';

const App = () => {
  ///States 
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  /// const [books, setBooks] = useState([])

  const handleOpenModal = (loginMode = false) => {
    console.log('Opening modal:', loginMode);
    setIsLoginMode(loginMode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogout = () =>{
    fetch('/api/logout', { method: 'POST' });
    setLoggedIn(false);
    /// returns to homepage
    window.location.href = '/';
  }


  const router = createBrowserRouter(///main router object
    createRoutesFromElements(
      <Route
        path="/" ///applies mainlay out to all paths with / 
        element={<MainLayout loggedIn={loggedIn} handleOpenModal={handleOpenModal} showModal={showModal} isLoginMode={isLoginMode} handleCloseModal={handleCloseModal} handleLogout = {handleLogout} setLoggedIn={setLoggedIn} />}
      >
        <Route index element={<HomePage handleOpenModal={handleOpenModal} loggedIn={loggedIn} />} />
        <Route path="/search" element={<BookSearch loggedIn={loggedIn}/>} />
        <Route path='/matcher' element={<Matcher loggedIn={loggedIn}/>}/>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  /// takes router as a prop to render
  return <RouterProvider router={router} />;
};

export default App;
