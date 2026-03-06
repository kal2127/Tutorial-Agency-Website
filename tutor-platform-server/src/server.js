const env = require("./config/env");
const app = require("./app");

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});
