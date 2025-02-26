const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware
    }
    res.status(401).json({ message: "Unauthorized: Please log in with Google" });
  };
  
  module.exports = authenticate;
  