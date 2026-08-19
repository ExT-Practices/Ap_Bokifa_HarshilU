const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");

const authorRoutes = require("./routes/authorRoutes");

const bookRoutes = require("./routes/bookRoutes");

const blogRoutes = require("./routes/blogRoutes");

const authRoutes = require("./routes/authRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bookify API Running...");
});

app.use("/api/authors", authorRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});