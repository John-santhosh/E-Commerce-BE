import dotenv from "dotenv";
import { createServer } from "./server";

dotenv.config();

const port = process.env.PORT;
const app = createServer();

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
