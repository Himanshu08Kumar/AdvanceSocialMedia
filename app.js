const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyparser.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
