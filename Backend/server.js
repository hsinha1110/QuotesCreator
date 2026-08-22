require("dotenv").config();

console.log("GROQ KEY:", process.env.GROQ_API_KEY ? "LOADED" : "MISSING");
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
