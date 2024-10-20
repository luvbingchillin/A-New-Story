
import React ,{useContext, useState, useEffect} from "react";
import { AuthContext } from "../Context/AuthContext";
import MyBookCards from "../components/MyBookCards";
import { ClipLoader } from 'react-spinners';
import config from '../config';

const MyBooks = () =>{
    const {loggedIn} = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetchbooks()
    },[]);

    const fetchbooks = async() =>{
        try {
            const booklist = await fetch(`${config.backendUrl}/api/bookshelf/`,{
                method: 'GET',
                credentials: 'include',
            });
        if (booklist.status === 401){
            setErrorMessage("You need to be logged in to see your books")
        }
        else if(booklist.ok){
            const data = await booklist.json();
            console.log(data)
            const booksWithImages = await Promise.all(
                data.map(async(book)=>{
                    const isbn = book.isbn_10;
                    try{
                        const response = await fetch(`${config.backendUrl}/api/search?query=${encodeURIComponent(`isbn:${isbn}`)}`)
                        const Data =  await response.json()
                        const books = Data.items
                        return books;
                       
                    }
                    catch (error){
                        console.error("Failed to fetch data from google api")
                    }
                    
                })
            )
            console.log("data passing down?", booksWithImages)
            setBooks(booksWithImages);
        }
        } catch (error) {
            console.error("Failed to fetch bookshelf data")
        } finally{
            console.log("data passing down", books)
            setLoading(false);
        }
    }

    return(loading ? (<div className="flex items-center justify-center min-h-screen bg-[#F4F1EA]"><ClipLoader color="#3498db" size={150} /></div>)
    : errorMessage ? (<div className="flex items-center justify-center min-h-screen bg-[#F4F1EA] text-[70px]">{errorMessage}</div>)
    :(<div className="w-screen min-h-screen bg-[#F4F1EA] px-8">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-6 ">
        {books.map((book, index)=>(
        <MyBookCards key={index} bookdata = {book}/>
        ))}
        </div>
    </div>))
}

export default MyBooks;