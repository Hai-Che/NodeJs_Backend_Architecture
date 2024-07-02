import app from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Terminate server"));
});
