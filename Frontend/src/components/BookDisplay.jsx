import React, { useState } from 'react';

const BookDisplay = ({ books, onAddBook }) => {
  const [currentPage, setCurrentPage] = useState(0); 
  const booksPerPage = 5;

  if (!books || books.length === 0) {
    return <p>No results found.</p>;
  }
  
  const booksWithImages = books.filter(book => book.volumeInfo.imageLinks?.thumbnail);

  const totalPages = Math.ceil(booksWithImages.length / booksPerPage);

  const currentBooks = booksWithImages.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch('/api/addtoBS',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        credentials: 'include',
        body:JSON.stringify(bookData)
      });
      if (response.ok){
        console.log("Success YAYYYYY");
        onAddBook();
      }
      else{
        console.log("oh no :((((9")
      }
    } catch (error) {
      console.log("Runtime error :( ")
    }
  }

  return (
    <div className="mt-8">
      <ul className="border-t border-gray-300">
        {currentBooks.map((book, index) => (
          <li key={index} className="mb-4 p-2 border-b border-gray-300 flex justify-start gap-x-3">
            <div>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{book.volumeInfo.title}</h3>
              <p>By: {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
              <p>Published: {book.volumeInfo.publishedDate || 'Unknown Date'}</p>
              {book.volumeInfo.industryIdentifiers && (
                <div>
                  <h4>ISBNs:</h4>
                  <ul>
                    {['ISBN_10', 'ISBN_13'].map((isbnType) => {
                      const identifier = book.volumeInfo.industryIdentifiers?.find(identifier => identifier.type === isbnType);
                      return (
                        <li key={isbnType}>
                          {isbnType}: {identifier ? identifier.identifier : 'N/A'}
                        </li>
                      );
                    })}
                  </ul>

                </div>
              )}
                <button
                  
                  onClick={() => {
                    // Get the necessary book information
                    const isbn_10 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier;
                    const isbn_13 = book.volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier;
                    const bookName = book.volumeInfo.title;
                    const author = book.volumeInfo.author;

                    // Prepare book data for the POST request
                    const bookData = {
                      isbn_10: isbn_10 || 'N/A',
                      isbn_13: isbn_13 || 'N/A',
                      book_name: bookName, 
                      author_name:author,
                    };

                    // Call handleAddBook and pass the bookData object
                    handleAddBook(bookData);
                  }}
                  className='bg-[#1E4A1C] hover:bg-[#245922] text-white rounded-md px-2 py-1'>
                Add to shelf
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="bg-gray-500 text-white p-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className="bg-gray-500 text-white p-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookDisplay;
