import express from "express";
const app = express();

const port = 8080;

// route handler for default home page
app.get("/", (req, res) => {
	res.send("Hello World!!");
});

// start the express server
app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`Server started at localhost on port ${port}`);
});
