import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hackathon-key';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired authentication token.' });
      }
      req.user = user;
      next();
    });
  } else {
    // Guest / Demo session fallback
    req.user = { id: 'usr-demo-001', email: 'guest@insightmesh.ai', isGuest: true };
    next();
  }
};
