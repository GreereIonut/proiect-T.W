const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // user here is the decoded payload
    if (err) {
      return res.status(403).json({ message: 'Token is not valid. Access forbidden.' });
    }
    req.user = user; // Attach the decoded token payload (e.g., { userId: 1, role: 'ADMIN' }) to the request object
    next();
  });
}

module.exports = authenticateToken;