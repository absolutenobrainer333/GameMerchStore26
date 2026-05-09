const express = require("express");
const cors = require("cors");
const { sequelize } = require("./dbcontext/sequelize");
const routerProduct = require("./routes/UserRoute/routerProduct");
const routerAuth = require("./routes/UserRoute/routerAuth");
const routerOrder = require("./routes/UserRoute/routerOrder");
const routerProductManagement = require("./routes/AdminRoute/routerProductManagement");
const routerGeneral = require("./routes/routerGeneral");

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// General Route
app.use("/general", routerGeneral);

// User Route
app.use("/product", routerProduct);
app.use("/auth", routerAuth);
app.use("/order", routerOrder);

// Admin Route
app.use("/productManagement", routerProductManagement);

app.use("/*", (req, res) => res.status(404).json({ error: "Page not found" }));

const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
