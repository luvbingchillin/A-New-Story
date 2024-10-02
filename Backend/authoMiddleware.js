const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const verifyToken = (req, res, next) => {
  // Retrieve the JWT from the HttpOnly cookie

  const token = req.cookies.accessToken;
  console.log(token)
  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
    console.log('no token');
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // If valid, set the decoded userId to the request object for use in routes
    req.userId = decoded.userId;
    next(); // Pass control to the next middleware or route handler
  });
};

module.exports = verifyToken;
