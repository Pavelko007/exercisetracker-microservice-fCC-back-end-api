const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const users = {};

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;
  const userId = Object.keys(users).length + 1;

  // Check if the username already exists
  const existingUser = Object.values(users).find(
    (user) => user.username === username
  );
  if (existingUser) {
    return res.json(existingUser);
  }

  const newUser = { username: username, _id: userId };
  users[userId] = newUser;

  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  res.json(Object.values(users));
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let date = req.body.date;
  date = date ? new Date(date).toDateString() : new Date().toDateString();
  res.json({
    _id: req.params._id,
    username: users[req.params._id].username, //todo
    date: date,
    duration: req.body.duration,
    description: req.body.description,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
