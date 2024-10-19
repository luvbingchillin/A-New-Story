import React, { useState, useContext } from 'react';
import surprise from '../assets/images/discover.jpg';
import normal from '../assets/images/test.jpeg';
import MatcherCards from './MatcherCards';
import SquigglyText from './Squigly';
import { AuthContext } from '../Context/AuthContext';
import config from '../config';


const MatcherInputs = () => {
  const [showContent, setShowContent] = useState(false);
  const [mode, setMode] = useState('');
  const [books, setBooks]= useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const {loggedIn} = useContext(AuthContext);

  const handleClick = (e) => {
    setMode(e);
    setShowContent(true);
    fetchRec(e)
  };

  const fetchRec = async(mode) =>{
    setLoading(true);
    {/*const mockData = {
      structuredRecommendations: [
        {
          name: 'Mock Book 1',
          author_name: 'Author 1',
          details: 'Fiction',
          img: 'https://via.placeholder.com/150', // Placeholder image
        },
        {
          name: 'Mock Book 2',
          author_name: 'Author 2',
          details: 'Non-fiction',
          img: 'https://via.placeholder.com/150', // Placeholder image
        },
        {
          name: 'Mock Book 3',
          author_name: 'Author 3',
          details: 'Fantasy',
          img: 'https://via.placeholder.com/150', // Placeholder image
        },
      ],
    };
    console.log('Using mock data for development.');
    setBooks(mockData.structuredRecommendations);
    setLoading(false); // Stop loading
    return;*/}
    try {
      const recs = await fetch(`${config.backendUrl}/api/recommendations`,{
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
      setBooks(data.validRecommendations);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch books due to server error');
    } finally {
    setLoading(false); // Stop the loading state
    }
  }

  const handleSwipe=async(direction)=>{
    console.log(`Swiped ${direction}`);
    console.log("Index:", currentIndex);
    console.log("Books Array:", books);
    console.log("Book at currentIndex:", books[currentIndex]);
    const bookData = {
      isbn_10: books[currentIndex].isbn10,
      isbn_13: books[currentIndex].isbn13,
      book_name: books[currentIndex].name,
      author_name: books[currentIndex].author_name,
    };
  
    if(direction === "left"){
      try {
        const addToShelf = await fetch('api/addtoBS',{
          method:'POST',
          headers:{
            'Content-type':'application/json',
          },
          credentials:'include',
          body:JSON.stringify(bookData)
        })
        if (addToShelf.ok) {     
          console.log("Book added");
        }
      } catch (error) {
        console.log("failed to add to bookshelf")
      }

    }
    else{
        console.log("book rejected")
    }
    if(currentIndex<books.length-1){
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    else{
      console.log("no more books")
    }

  }



  return (
    <div className="w-full h-full font-poppins bg-[#182c25]">
      {!showContent && (
        <div className="w-full h-screen flex">
          {/* Normal recommendations button */}
          <button
  className="w-1/2 h-full pb-[80px] text-[100px] relative overflow-hidden transition-all group"
  style={{
    backgroundColor: 'rgba(190,143,60)', // Light brown background
    borderTopRightRadius: '40px', // No rounding for the top-right corner
     // Shadow for depth
    border: '1px solid rgba(150, 120, 85, 0.5)', // Border to enhance the book feel
  }}
  onClick={() => handleClick('normal')}
  onMouseEnter={() => setIsHoveredLeft(true)}
  onMouseLeave={() => setIsHoveredLeft(false)}
>
<span
      className="relative z-10 text-white transition-all group-hover:text-[#1E4A1C] cursor-pointer"
    >
      {isHoveredLeft ? <SquigglyText text="Match Me!" /> : 'Match Me!'}
    </span>
  
  {/* Background image transition */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-700 group-hover:opacity-100"
    style={{
      backgroundImage: `url(${normal})`,
    }}
  ></div>
</button>


          {/* Surprise me button */}
          <button
  className="w-1/2 h-full pb-[80px] text-[100px] relative overflow-hidden transition-all group"
  style={{
    backgroundColor: 'rgba(200, 148, 65)', // Dark brown background
    borderTopLeftRadius: '40px', // Rounded top-left corner
    boxShadow: '-20px 0px 30px rgba(0, 0, 0, 0.2)',// Shadow for depth
    border: '1px solid rgba(150, 120, 85, 0.5)', // Border to enhance the book feel
  }}
  onClick={() => handleClick('surprising')}
  onMouseEnter={() => setIsHoveredRight(true)}
  onMouseLeave={() => setIsHoveredRight(false)}
>
<span
      className="relative z-10 text-white transition-all group-hover:text-[#1E4A1C] cursor-pointer"
    >
      {isHoveredRight ? <SquigglyText text="Surprise Me!" /> : 'Surprise Me!'}
    </span>
  {/* Background image transition */}
  <div
    className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-700 group-hover:opacity-100"
    style={{
      backgroundImage: `url(${surprise})`,
    }}
  ></div>
</button>


        </div>
      )}
      {showContent && ( <div className="relative w-full h-screen flex justify-center items-center ">
        {!loggedIn ? (
  <div className="text-center mx-auto text-5xl text-red-500">Please Login To Start Matching</div>
) : errorMessage ? (
  <div className="text-center mx-auto text-5xl text-red-500">{errorMessage}</div>
) : loading ? (
  <div className="text-center mx-auto text-7xl text-white">
  <SquigglyText text="Loading Books!" />
  </div>
) : books.length > 0 && currentIndex < books.length-1 ? (
  <MatcherCards
    onSwipe={handleSwipe}
    book={books[currentIndex]}
  />
) : (
  <div className="text-center mx-auto text-5xl text-white">No more recommendations available.</div>
)}

        </div>
      )}
    </div>
  );
};

export default MatcherInputs;
