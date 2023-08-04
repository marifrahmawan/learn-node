const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization').split(' ')[1];
  const authHeader = req.get('Authorization');
  
  if(!authHeader){
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error('Not Authenticated');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
