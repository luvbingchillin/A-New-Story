import React, { useState, useEffect } from 'react';
import surprise from '../assets/images/discover.jpg';
import normal from '../assets/images/test.jpeg';
import MatcherCards from './MatcherCards';

const MatcherInputs = () => {
  const [showContent, setShowContent] = useState(false);
  const [mode, setMode] = useState('');
  const [books, setBooks]= useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = (e) => {
    setMode(e);
    setShowContent(true);
    fetchRec(e)
  };

  const fetchRec = async(mode) =>{
    setLoading(true);
    try {
      const recs = await fetch('/api/recommendations',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({mode}),
      })
      if(!recs.ok){
        setErrorMessage('Failed to fetch books');
        return;
      }
      const data = await recs.json();
      console.log('Response Data:', data);
      setBooks(data.structuredRecommendations);
      
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch books due to server error');
    } finally {
    setLoading(false); // Stop the loading state
    }
  }

  const handleSwipe=(direction, index)=>{
    console.log(`Swiped ${direction}`);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }



  return (
    <div className="w-full h-full font-poppins">
      {!showContent && (
        <div className="w-full h-screen flex">
          {/* Normal recommendations button */}
          <button
            className="w-1/2 h-full pb-[80px] text-[80px] relative overflow-hidden transition-all group"
            style={{
              backgroundColor: 'rgba(255,255,255)',
            }}
            onClick={() => handleClick('normal')}
          >
            <span className="relative z-10 text-black transition-all group-hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[4px] after:bg-white after:w-full after:origin-center after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-700">
              Match Me!
            </span>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                backgroundImage: `url(${normal})`,
              }}
            ></div>
          </button>

          {/* Surprise me button */}
          <button
            className="w-1/2 h-full pb-[80px] text-[80px] relative overflow-hidden transition-all group"
            style={{
              backgroundColor: 'rgba(54,34,11)',
            }}
            onClick={() => handleClick('surprising')}
          >
            <span className="relative z-10 text-white transition-all group-hover:text-[#1E4A1C] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[4px] after:bg-[#1E4A1C] after:w-full after:origin-center after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-700">
              Surprise Me!
            </span>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                backgroundImage: `url(${surprise})`,
              }}
            ></div>
          </button>
        </div>
      )}
      {showContent && ( <div className="relative w-full h-screen flex justify-center items-center">
        {loading && <div>Loading books...</div>}

        {errorMessage ? 
        (<div className="text-center mx-auto text-red-500">{errorMessage}</div> 
        ) :(
          !loading && 
          books.length > 0 &&  
          currentIndex < books.length &&(
            <MatcherCards 
            onSwipe={handleSwipe}  
            book={books[currentIndex]} 
            />
          )
        )}
        {!loading && books.length === 0 && <div>No books available.</div>}
        </div>
      )}
    </div>
  );
};

export default MatcherInputs;
