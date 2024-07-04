import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import server from "./app";

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
