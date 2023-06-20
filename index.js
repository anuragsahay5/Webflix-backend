const express = require("express");
const cors = require("cors");
const route = require("./src/route");

const app = express();
const port = 3000 || process.env.port;

app.use(express.json());
app.use(cors());
app.use("/api", route);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
