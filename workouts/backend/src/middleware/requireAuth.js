import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  // Check of er Authorization header is
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Je moet ingelogd zijn" });
  }

  // Haal token uit header (format: "Bearer ")
  const token = authorization.split(" ")[1];

  try {
    // Verifieer token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Haal user op en zet in request
    req.user = await User.findById(userId).select("_id email");

    // Ga door naar controller
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is niet geldig" });
  }
};
