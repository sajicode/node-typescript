import dotenv from "dotenv";
import express from "express";
import path from "path";

// initialize configuration
dotenv.config();

// port is available on Node.js runtime as environment variable
const port = process.env.SERVER_PORT;

const app = express();

// configure express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// route handler for default home page
app.get("/", (req, res) => {
	// render the index template
	res.render("index");
});

// start the express server
app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server started at localhost on port ${port}`);
});
