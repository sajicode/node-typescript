"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sessionAuth = __importStar(require("./middleware/sessionAuth"));
const routes = __importStar(require("./routes"));
// initialize configuration
dotenv_1.default.config();
// port is available on Node.js runtime as environment variable
const port = process.env.SERVER_PORT;
const app = express_1.default();
// configure express to use EJS
app.set("views", path_1.default.join(__dirname, "views"));
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
//# sourceMappingURL=index.js.map