import React, { useState } from 'react';
import BookDisplay from '../components/BookDisplay';


{/* can replace with webscrapping amazon search results instead of google api???*/}
const SearchBar = ({onAddBook}) => {
  //onAddbook is a function that update refresh trigger state in parent 
  const [SearchData, SetSearchData] = useState({
    query: '',
  });
  const [SelectOption, SetSelectOption] = useState('all');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

   /// e is an event object that is passed
  const handleChange = (e) => {
    // updates search data when input is changed
    SetSearchData({
      ...SearchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRadioChange = (e) => {
    SetSelectOption(e.target.value);
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    
    console.log('Submit button clicked'); // Debugging

    let query = SearchData.query;
    if (!query) {
      setErrorMessage('Please enter a search query');
      return;
    }

    let queryString = '';
    if (SelectOption === 'title') {
      queryString = `intitle:${query}`;
    } else if (SelectOption === 'author') {
      queryString = `inauthor:${query}`;
    } else if (SelectOption === 'isbn') {
      queryString = `isbn:${query}`;
    } else {
      queryString = query;
    }

    console.log('Querying:', queryString); // Debugg zzzzz sian

    try {
      const response = await fetch(`/api/search?query=${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Bum 
      // filter response data
      const filteredBooks = data.items.filter(book => {
        const categories = book.volumeInfo.categories || [];
        const identifiers = book.volumeInfo.industryIdentifiers || [];
        const hasIsbn = identifiers.some(id => id.type === 'ISBN_10' || id.type === 'ISBN_13');
        return !categories.includes('Comics & Graphic Novels') && hasIsbn;
      });
      setResults(filteredBooks || []); 
      setHasSearched(true); 
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };

  return (
    <section className=" w-[60%] mx-auto pt-5 font-poppins h-auto">
      <div className="pl-4 mt-1 mb-2 font-semibold text-3xl">Search</div>
      <div className="bg-[#1E4A1C] rounded-md p-4 space-y-4">
        <form onSubmit={handleSubmit} className="w-[80%]">
          <div className="flex justify-start items-center space-x-3">
            <input
              id="query"
              type="text"
              name="query"
              className="w-full p-2 border border-gray-300 rounded-sm"
              placeholder="Search by Book Title, Author or ISBN"
              value={SearchData.query}
              onChange={handleChange}
            />
          <button
            type="submit"
            className="bg-[#E0C5A8] hover:bg-[#b8884e] text-black rounded-sm w-[75px] h-10 border-[1px]"
          >
            Search
          </button>
        </div>
        </form>

        <div className="flex justify-start gap-4 text-white">
          <label className="flex items-center">
            <input
              type="radio"
              name="searchOption"
              value="all"
              checked={SelectOption === 'all'}
              onChange={handleRadioChange}
              className="form-radio h-4 w-5"
            />
            <span className="ml-2">All</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="searchOption"
              value="title"
              checked={SelectOption === 'title'}
              onChange={handleRadioChange}
              className="form-radio h-4 w-5"
            />
            <span className="ml-2">Title</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="searchOption"
              value="author"
              checked={SelectOption === 'author'}
              onChange={handleRadioChange}
              className="form-radio h-4 w-5"
            />
            <span className="ml-2">Author</span>
          </label>
        </div>
      </div>

  
      {hasSearched && <BookDisplay books={results}  onAddBook={onAddBook}/>}
    </section>
  );
};

export default SearchBar;
