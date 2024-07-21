const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const users = {};
const userLogs = {};

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;

  // Check if the username already exists
  const existingUser = Object.values(users).find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.json(existingUser);
  }
  let userId = generateId();

  function generateId() {
    const characters = "0123456789abcdef";
    let id = "";
    do {
      id = "";
      for (let i = 0; i < 24; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
      }
    } while (users.hasOwnProperty(id));
    return id;
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
  const _id = req.params._id;
  let log = users[_id];
  log.date = date;
  log.duration = parseInt(req.body.duration);
  log.description = req.body.description;

  if (!userLogs[_id]) {
    userLogs[_id] = [];
  }

  userLogs[_id].push({
    description: log.description,
    duration: log.duration,
    date: log.date,
  });
  res.json(log);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const _id = req.params._id;
  let user = users[_id];
  let userLog = userLogs[_id];
  if(req.query.from){
    console.log(req.query.from)
  }
  if(req.query.to){
    console.log(req.query.to)
  }
  if(req.query.limit){
    console.log(req.query.limit)
  }

  if (userLog && req.query.from && req.query.to) {
    const fromDate = new Date(req.query.from);
    const toDate = new Date(req.query.to);
    userLog = userLog.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= fromDate && logDate <= toDate;
    });
  }

  if (userLog && req.query.limit) {
    const limit = parseInt(req.query.limit);
    userLog = userLog.slice(0, limit);
  }

  res.json({
    ...user,
    count: userLog ? userLog.length : 0,
    log: userLog,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
