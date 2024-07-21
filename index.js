const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  //todo
  res.json({ username: "Pavlo", _id: "669d2288f3f0350013ad4330" });
});

app.get("/api/users", (req, res) => {
  //todo
  res.json([{ username: "Pavlo", _id: "669d2288f3f0350013ad4330" }]);
});

app.post("/api/users/:_id/exercises", (req, res)=>{
  //todo
  res.json({});
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
