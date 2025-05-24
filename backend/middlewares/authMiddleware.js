import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; 
    console.log(token,"token")
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error,"error from middleware")
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
