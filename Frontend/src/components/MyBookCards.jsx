import {FaTrash} from 'react-icons/fa'
import { useState } from 'react';
import config from '../config';

const MyBookCards = ({ bookdata }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    console.log("+A")
    const book = bookdata[0]; // Access the book object from the props
    console.log("final book data", book)


    const handleDeleteClick = async() => {
      setIsDeleting(true); // Start the animation
      const isbn_10 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;
      const isbn_13 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier;
      try {
        const response = await fetch(`${config.backendUrl}/api/bookshelf`,{
          method: 'DELETE',
          headers: {
            'Content-Type':'application/json',
          },
          credentials: 'include',
          body:JSON.stringify({
            isbn_10: isbn_10 || 'N/A',
            isbn_13: isbn_13 || 'N/A',
          })
        });
        if (response.ok){
          console.log("Success YAYYYYY");
        }
        else{
          console.log("oh no :((((9")
        }
      } catch (error) {
        console.log("Runtime error :( ")
      }
    }


    return (
      <div className={`mt-8 border-4 border-black rounded-lg relative group bg-amber-300 ${isDeleting ? 'spin-out' : ''}`}>
        <button className="absolute top-1 right-1 text-red-600 hover:text-red-800 z-10 invisible group-hover:visible transition-opacity duration-400" 
        onClick={() => handleDeleteClick()}>
                <FaTrash size={18} />
            </button>
        <div className="group-hover:invisible  h-[98%] ">
          {book.volumeInfo?.imageLinks?.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title || "Book Cover"}
              className="w-full h-full object-fill border-b-4 border-black"
            />
          ) : (
            <p>No image available</p> // Fallback if no image is found
          )}
        </div>

        <div className="absolute inset-0 bg-brown-200 p-4 invisible group-hover:visible transition-opacity duration-300 bg-amber-300">
          <h3 className="font-semibold text-center text-sm">{book.volumeInfo?.title || 'No Title Available'}</h3>
          <p className="text-xs mt-3">By: {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</p>
          <p className="text-xs">Published:<br/> {book.volumeInfo?.publishedDate || 'Unknown Date'}</p>
        </div>
      </div>
    );
  };
export default MyBookCards;
