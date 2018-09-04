const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const posts = require("./routes/api/posts");

const app = express();
const PORT = process.env.PORT || 5000;

// DB config
const db = require("./config/keys").mongoURI;

// connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("...Connected to mongoDB"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("გამარჯობა"));

//Use Routes
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/posts", posts);

app.listen(PORT, () => console.log(`...Server running on port ${PORT}`));
