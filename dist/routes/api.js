"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
exports.register = (app) => {
    const oidc = app.locals.oidc;
    const port = parseInt(process.env.PGPORT || "5432", 10);
    const config = {
        databse: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user: process.env.PGUSER || "postgres"
    };
    const pgp = pg_promise_1.default();
    const db = pgp(config);
    app.get(`/api/games/all`, oidc.ensureAuthenticated(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userContext.userinfo.sub;
            const total = yield db.one(`
      SELECT count(*) AS total
      FROM   games
      WHERE  user_id = $[userId]`, { userId }, (data) => {
                return {
                    total: +data.total
                };
            });
            return res.json(total);
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({ error: error.message || error });
        }
    }));
    app.get(`/api/games/find/:search`, oidc.ensureAuthenticated(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userContext.userinfo.sub;
            const games = yield db.any(`
      SELECT
          id
          , title
          , genre
          , year
          , company
      FROM   games
      WHERE  user_id = $[userId]
      AND   (title ILIKE $[search] OR genre ILIKE $[search])`, { userId, search: `%${req.params.search}%` });
            return res.json(games);
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({ error: error.message || error });
        }
    }));
    app.post(`/api/games/add`, oidc.ensureAuthenticated(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = yield db.one(`
          INSERT INTO games(user_id, title, genre, year, company)
          VALUES($[userId], $[title], $[genre], $[year], $[company])
          RETURNING id;`, Object.assign({ userId }, req.body));
            return res.json({ id });
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({ error: error.message || error });
        }
    }));
    app.post(`/api/games/update`, oidc.ensureAuthenticated(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = yield db.one(`
        UPDATE games
        SET title = $[title]
            , genre = $[genre]
            , year = $[year]
            , company = $[company]
        WHERE
            id = $[id]
            AND user_id = $[userId]
        RETURNING
            id;`, Object.assign({ userId }, req.body));
            return res.json({ id });
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({ error: error.message || error });
        }
    }));
    app.delete(`/api/games/remove/:id`, oidc.ensureAuthenticated(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userContext.userinfo.sub;
            const id = yield db.result(`
          DELETE
          FROM   games
          WHERE  user_id = $[userId]
          AND   id = $[id]`, { userId, id: req.params.id }, (r) => r.rowCount);
            return res.json({ id });
        }
        catch (error) {
            // tslint:disable-next-line:no-console
            console.error(error);
            res.json({ error: error.message || error });
        }
    }));
};
//# sourceMappingURL=api.js.map