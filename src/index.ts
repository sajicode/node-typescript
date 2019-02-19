import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as sessionAuth from "./middleware/sessionAuth";
import * as routes from "./routes";

// initialize configuration
dotenv.config();

// port is available on Node.js runtime as environment variable
const port = process.env.SERVER_PORT;

const app = express();

// Configure express to parse incoming JSON data
app.use(express.json());

// configure express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure session auth
sessionAuth.register(app);

// Configure routes
routes.register(app);

// start the express server
app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server started at localhost on port ${port}`);
});
