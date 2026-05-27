require("dotenv").config();
const express = require("express");
const path = require("path");

const connectDb = require("./db/database");
const authRoutes = require("./routes/auth-routes");
const lostRoutes = require("./routes/lost-router");
const foundRoutes = require("./routes/found-routes");
const sessionConfig = require("./config/session");
const passport = require("./config/passport");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/lost", lostRoutes);
app.use("/found", foundRoutes);

connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on Port ${process.env.PORT}`);
  });
});
