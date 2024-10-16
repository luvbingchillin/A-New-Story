import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainLayout from './Layouts/MainLayout';
import BookSearch from './pages/BookSearch';
import NotFound from './pages/NotFound';
import Matcher from './pages/Matcher';
import { AuthProvider } from './Context/AuthContext'; // AuthProvider to wrap the app
import { useState } from 'react';

const App = () => {
  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleOpenModal = (loginMode = false) => {
    setIsLoginMode(loginMode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Create the router with routes
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            handleOpenModal={handleOpenModal}
            showModal={showModal}
            isLoginMode={isLoginMode}
            handleCloseModal={handleCloseModal}
          />
        }
      >
        <Route index element={<HomePage handleOpenModal={handleOpenModal} />} />
        <Route path="/search" element={<BookSearch />} />
        <Route path="/matcher" element={<Matcher />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  // Wrap RouterProvider with AuthProvider
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
