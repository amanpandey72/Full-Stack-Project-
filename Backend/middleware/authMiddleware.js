// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) return res.status(401).json({ message: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("TOKEN:", token);
//     console.log("SECRET:", process.env.JWT_SECRET);
//     console.log("VERIFY SECRET:", process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch(err) {
//     console.log("JWT ERROR:", err.message);
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  // 🔥 FIX: Extract token after "Bearer"
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("TOKEN:", token);
    console.log("SECRET:", process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};