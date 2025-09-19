const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied, token missing" });

    try {
      const decoded = jwt.verify(token, "SECRET_KEY"); // use env in real apps
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient rights" });
      }

      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

module.exports = authMiddleware;
