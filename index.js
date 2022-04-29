const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const route = require("./routes");

app.use(cors());

// init route
route(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
