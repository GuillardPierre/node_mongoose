import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || req.query.user_id;

    if (!userId) {
      return res.status(401).json({
        error: "Authentication required. Please provide x-user-id header",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        error: "Invalid user",
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Authentication failed",
    });
  }
};

export default auth;
