const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const main = require("./views/main");
const { db, Page, User } = require("./models");

app.use(morgan("dev"));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // check how this works

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  res.redirect("/wiki");
});

app.use("/wiki", require("./routes/wiki"));
app.use("/users", require("./routes/user"));

db.authenticate().then(() => {
  console.log("connected to the database");
});

const PORT = 3000;

const init = async () => {
  await db.sync();
  app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
  });
};

init();
