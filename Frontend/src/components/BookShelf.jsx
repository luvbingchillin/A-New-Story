import React, { useEffect, useState } from 'react';
import config from '../config';

const BookShelf = ({ refreshTrigger }) => {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const fetchBooks = async () => {
    try {
      const bookList = await fetch(`${config.backendUrl}/api/bookshelf/`, {
        method: 'GET',
        credentials: 'include',
      });

      if (bookList.status === 401) {
        setErrorMessage('You need to be logged in to see your bookshelf');
        setBooks([]); // Clear books if not authorized
      } else if (bookList.ok) {
        const data = await bookList.json();
        setBooks(data);
      } else {
        console.log('Failed to fetch books');
        setErrorMessage('Failed to fetch books');
      }
    } catch (error) {
      console.log('Runtime error:', error);
      setErrorMessage('Failed to fetch books due to server error');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchBooks(); // Fetch books on initial load
  }, [refreshTrigger]); // Re-fetch books whenever refreshTrigger changes

  return (
    <div className='w-1/5 h-auto mt-[100px] mt-[190px] mr-[80px]'>
      <h2 className='flex justify-start font-poppins text-2xl font-semibold '>
        Bookshelf
      </h2>
      <hr className="border-1 border-black"/>
      {isLoading ? (
        <div className='text-center p-4'>Loading your bookshelf...</div>
      ) : errorMessage ? (
        <div className=' text-center mx-auto '>{errorMessage}</div> ///if loading else if error else iterate through book array
      ) : books.length > 0 ? (
        <ul>
          {books.map((book, index) => (
            <li key={index} className=''>
              {book.book_name}
            </li>
          ))}
        </ul>
      ) : (
        <div className=''>No books found in bookshelf.</div>
      )}
    </div>
  );
};

export default BookShelf;
