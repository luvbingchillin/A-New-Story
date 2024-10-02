import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const SignUpModal = ({ show, handleClose, setLoggedIn, isLoginMode = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLogin, setIsLogin] = useState(isLoginMode); 
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setIsVisible(true);
      }, 10); 
    } else {
      setIsVisible(false);
    }
  }, [show]); /// controls visibility based on show


  useEffect(() => {
    setIsLogin(isLoginMode);
    clearFormData();        
  }, [isLoginMode]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const clearFormData = () =>{
    setFormData({
      username:'',
      email:'',
      password:'',
      confirmPassword:''
    });
  };

  const handleClick = () =>{ /// change btw signup and login while reseting from 
    setAnimation(true);
    setTimeout(()=>{
      setIsLogin(!isLogin);
      clearFormData();
      setAnimation(false);
    }, 300)

  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) { /// signup
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          handleClose(); 
        } else {
          const error = await response.json();
          alert(error.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    } else {
      /// login
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setLoggedIn(true); // Assume user is logged in if the login request succeeds
          handleClose();
        }
         else {
          const error = await response.json();
          alert(error.error);
        }
      } catch (err) {
        console.error('Error:', err); 
      }
    }
  };

  const modalHeight = isLogin ? '330px' : '520px'; 
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins">
      <div
        className={`bg-[#F4F2EF] p-6 rounded-xl w-[420px] transition-transform duration-500 ease-out transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        } ${animation ? 'transition-all duration-300' : ''}`}
        style={{ height: modalHeight, overflow: 'hidden', transition: 'height 0.3s ease-in-out' }} // Add height transition
      >
        <header className="flex items-center justify-between mb-3">
          <h2 className="text-3xl text-[#382110] font-semibold">
            {isLogin ? 'Log In' : 'Create Account'}
          </h2>
          <button onClick={handleClose}>
            <AiOutlineClose size={24} color="grey" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          {/* Username field for signup only */}
            <div className="mb-4">
              <label className="block text-l mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-full"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

          {/* Email field */}
          {!isLogin && (
          <div className="mb-4">
            <label className="block text-l mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-full"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>)}

          {/* Password field */}
          <div className="mb-4">
            <label className="block text-l mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border border-gray-300 rounded-full"
              placeholder="At least 8 characters long"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password field for signup only */}
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-l mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full p-2 border border-gray-300 rounded-full"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full w-full">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <span onClick={handleClick} className="text-[#1E4A1C] hover:text-[#245922] cursor-pointer block text-center">
          {isLogin ? 'Don’t have an account? Sign up' : 'Already have an account? Log in instead'}
        </span>
      </div>
    </div>
  );
};

export default SignUpModal;
