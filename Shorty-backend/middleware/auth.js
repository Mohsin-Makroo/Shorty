import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Format of authHeader should be 'Bearer <token>'
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token found in authorization header' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // assign user info from token to request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}
