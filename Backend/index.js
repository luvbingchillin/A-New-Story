
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {OpenAI} = require('openai');
const {createClient} = require('@supabase/supabase-js')
const PORT = process.env.PORT || 5000;




require('dotenv').config()
///supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);


/// import jwt verification function
const verifyToken = require('./authoMiddleware')


// load enviromental variables form env file




// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY,});


// Route to search for books using the Google Books API
app.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Make a request to the Google Books API with filters
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}}&printType=books&maxResults=40&orderBy=relevance&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Google Books API:', error.message);
    res.status(500).json({ message: 'Failed to fetch books data from Google Books API' });
  }
});



// POST route for user signup (store in PostgreSQL)
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the input
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
    .from('users')
    .insert([{ username, email, password: hashedPassword },
    ])
    .select()
    console.log(data)
    const newUser = data[0];
    res.status(201).json({ message: "User created successfully", user: newUser });  

  } catch (error) {
    console.error('Error inserting user:', error);

    // Handle unique constraint violation?? is this needed?
    if (error.code === '23505') {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generic error handling
    res.status(500).json({ error: "An error occurred while creating the user" });
  }
});


app.post('/api/login', async (req,res)=>{

  const {username, password} = req.body;
  if(!username||!password){
    return  res.status(400).json({ error: "All fields are required" }); 
  }
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if(users.length ===0){
      return res.status(404).json({error:"Invalid username or password"})
    }

    const user = users[0];
    const wordMatch = await bcrypt.compare(password, user.password);
    if(!wordMatch){
      return res.status(404).json({error:'Invalid password'})
    }

    ///res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });

    const payload = {userId: user.id, userName: user.username };
    // create tokens that can be deconded to store id and username
    const accessToken =  jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'1h'})
    const refreshToken =  jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'7d'})
    // refreshing api to be implemented later
    res.cookie('accessToken', accessToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      maxAge: 7 * 24* 60 * 60 * 1000
    })

    res.status(200).json({message: 'Logged in successfully'})
    
  } catch (error) {
    console.error("Error during login", error);
    return res.status(500).json({error:'Error during login'});
  }
})

// update sql to add books, verifytoken runs
app.post('/api/addtoBS',verifyToken, async(req,res)=>{
  try {
    const {isbn_10, isbn_13, book_name, author_name} = req.body;
    console.log('Request Body:', req.body);
    const user_uuid = req.userId;
    const { data, error } = await supabase
      .from('bookshelf')
      .insert([{ isbn_10, isbn_13, book_name, user_uuid, author_name }]);

    return res.status(200).json({message:"Book added to bookshelf"})
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding book" });
  }
})


// request books from sql, verifytoken runs
app.get('/api/bookshelf', verifyToken, async (req, res) => {
  try {
    // The userId is now available via req.userId, set by the verifyToken middleware
    const userId = req.userId;
    console.log(userId);

    // Query the database for the user's bookshelf based on userId
    const { data: books, error } = await supabase
      .from('bookshelf')
      .select('*')
      .eq('user_uuid', userId);

    // If books found, return them; else, return an empty array or a message
    if (books.length > 0) {
      res.status(200).json(books);
    } else {
      res.status(200).json({ message: 'No books found' });
    }
  } catch (error) {
    console.error('Error fetching bookshelf:', error);
    res.status(500).json({ error: 'An error occurred while fetching the bookshelf' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
  
});

///recommendations
 app.post('/api/recommendations', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const type = req.body;

    // Fetch user's favorited books from the database
    const result = await pool.query(
      'SELECT book_name, author_name FROM bookshelf WHERE user_uuid = $1', [userId]
    );

    // If the user has no books in the bookshelf, return an empty result
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No books in bookshelf' });
    }

    // Format the list of favorited books for the prompt
    const favoritedBooks = result.rows
      .map((row, index) => `${index + 1}. "${row.book_name}" by ${row.authors || "Unknown Author"}`)
      .join("\n");

    const prompt = `Here are the books I've favorited:\n${favoritedBooks}\nCan you recommend 3 similar books that I might enjoy? I want the recommendations to be ${type}$\n
                    generate the resoponse in the format of Name: Author: Details: without any other unessary text`;

    // Call OpenAI's API to get book recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // You can also use "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful assistant that recommends books based on user preferences." },
        { role: "user", content: prompt }
      ]
    });

    // Extract the recommendations from the OpenAI response
  
    const recommendations = response.choices[0].message.content;
    const recommendationsArray = recommendations
    .split(/Name:\s+/)  // Split the text by "Name: " to isolate each recommendation
    .filter(rec => rec.trim() !== "");  // Remove empty strings

  // Map each recommendation into an object with name, author_name, and details
  const structuredRecommendations = await Promise.all(recommendationsArray.map(async (rec) => {
    // Extract Name, Author, and Details using regex
    const nameMatch = rec.match(/^"(.+?)"/);
    const authorMatch = rec.match(/Author:\s+(.+)/);
    const detailsMatch = rec.match(/Details:\s+(.+)/);

    const  bookName= nameMatch ? nameMatch[1] : "Unknown";
    const  authorName= authorMatch ? authorMatch[1].trim() : "Unknown";
    const  details= detailsMatch ? detailsMatch[1].trim() : "No details available";

    if (bookName === "Unknown" || authorName  === "Unkown") {
      return null; // Return null if any field is missing
    }
   
    let imageUrl = 'No image available';
      try {
        const googleBooksResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookName}+inauthor:${authorName}&key=${process.env.GOOGLE_BOOKS_API_KEY}`);
        const bookData = googleBooksResponse.data.items[0];
        imageUrl = bookData.volumeInfo.imageLinks?.thumbnail || imageUrl;
      } catch (error) {
        console.error(`Error fetching image for ${bookName} by ${authorName}:`, error.message);
      }
    return{
      name:bookName,
      author_name:authorName,
      details:details,
      imageUrl: imageUrl
    }
  }));
  console.log(structuredRecommendations);
    // Send recommendations back to the client
    res.status(200).json({ structuredRecommendations });
  } catch (error) {
    console.error('Error fetching recommendations from OpenAI:', error);
    res.status(500).json({ message: 'An error occurred while generating recommendations' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
