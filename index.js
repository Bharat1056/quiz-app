import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/dbConfig.js";

dotenv.config({
  path: "./env",
});

await connectDB();

app.on("error", (error) => {
  console.log("Express doesn't connect to our database: ", error);
  throw error;
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on: ${process.env.PORT} PORT Number`);
});