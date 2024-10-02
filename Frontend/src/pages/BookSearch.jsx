import React, {useState} from 'react'
import SearchBar from '../components/SearchBar'
import BookShelf from '../components/BookShelf'

export const BookSearch = () => {
  /// passes handleAddbook into searchbar to update refreshtrigger which rerenders the bookshelf
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const handleAddBook = () => {
      setRefreshTrigger(!refreshTrigger);
    };

  return (
    <div className="min-h-screen p-4 bg-[#F4F1EA] flex">
      <SearchBar onAddBook={handleAddBook}/>
      <BookShelf refreshTrigger={refreshTrigger}/>
    </div>
  )
}

export default BookSearch;