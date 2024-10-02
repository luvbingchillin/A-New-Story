import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web'; 
import animationData from '../assets/Animations/tstKM9lgET.json'; 

const MatcherBT = ({ loggedIn, handleOpenModal }) => {
  const [opacity, setOpacity] = useState(1);
  const lottieRef = useRef(null); // Ref for the animation container

  useEffect(() => {
    // Initialize the Lottie animation
    const lottieInstance = lottie.loadAnimation({
      container: lottieRef.current, // DOM element to attach the animation
      renderer: 'svg', // Type of renderer
      loop: false,
      autoplay: false, 
      animationData: animationData,
    });

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const fadeEnd = 400;

      // Calculate opacity based on scroll
      const newOpacity = Math.max(0, 1 - scrollPosition / fadeEnd);
      setOpacity(newOpacity);

      if (scrollPosition > 350) {
        lottieInstance.setDirection(1); // Forward direction
        lottieInstance.setSpeed(0.8);
        lottieInstance.play(); // Play the animation
      } else {
        lottieInstance.setDirection(-1); // Reverse direction
        lottieInstance.setSpeed(1.7);
        lottieInstance.play(); // Play the animation in reverse
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      lottieInstance.destroy(); // Clean up Lottie instance
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center text-center font-poppins relative">
      {/* Text with opacity controlled by scroll */}
      <div style={{ opacity }}>
        <h2 className="text-[80px] font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-[white] via-[white] via-[#01A5F8] to-green-400 bg-[length:300%_100%] bg-left transition-all duration-1000 ease-linear hover:bg-[200%_100%] hover:cursor-default -mt-60 mb-5">
          Ready to meet a new book?
        </h2>

        {loggedIn ? (
          <a href="/matcher">
            <button className="text-white text-[30px] py-3 px-[50px] bg-[#1E4A1C] text-white py-2 px-6 rounded-full shadow-lg hover:bg-[#245922] focus:outline-none">
              Start Matching
            </button>
          </a>
        ) : (
          <button
            onClick={() => handleOpenModal(false)} 
            className="text-white text-[30px] py-3 px-[50px] bg-[#1E4A1C] text-white py-2 px-6 rounded-full shadow-lg hover:bg-[#245922] focus:outline-none"
          >
            Sign Up
          </button>
        )}
      </div>

      {/* Lottie animation container */}
      <div
        ref={lottieRef} // Reference for the Lottie animation container
        className="absolute bottom-0 right-4 z-10" // Absolute positioning to the bottom right corner
        style={{ width: '370px', height: '370px' }} 
      ></div>
    </div>
  );
};

export default MatcherBT;
