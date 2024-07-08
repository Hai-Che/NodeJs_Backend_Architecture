import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import instanceMongoDB from "./dbs/init.mongodb.js";
// import { checkOverload } from "./helpers/check.connect.js";
import mainRoute from "./routes/index.js";
const app = express();
//middlewares
app.use(helmet());
app.use(morgan("common"));
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//db
// checkOverload();
//routes
app.use("/", mainRoute);
//handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal server error",
  });
});

export default app;
