import express from "express";
import path from "path";
const app = express();

const port = 8080;

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
