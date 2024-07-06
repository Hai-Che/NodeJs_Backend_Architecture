import app from "./src/app.js";
import "dotenv/config";
import { checkOverload } from "./src/helpers/check.connect.js";

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

process.on("SIGINT", () => {
  clearInterval(checkOverload);
  server.close(() => console.log("Terminate server"));
  process.exit(0);
});
