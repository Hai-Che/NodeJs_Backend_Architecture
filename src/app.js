import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

//middlewares
app.use(helmet());
app.use(morgan("common"));
app.use(compression());
//db

//routes
app.use("/", (req, res, next) => {
  res.status(200).json({
    message: "Test route",
  });
});
export default app;
