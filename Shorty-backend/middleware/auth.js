import jwt from 'jsonwebtoken';

// This function acts as a "bouncer" for our protected routes
export default function (req, res, next) {
  // Get token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add user from payload to the request object
    next(); // Pass control to the next function in the chain
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}