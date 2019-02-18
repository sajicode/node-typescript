"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
const port = 8080;
// configure express to use EJS
app.set("views", path_1.default.join(__dirname, "views"));
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
//# sourceMappingURL=index.js.map