import * as express from "express";
import pgPromise from "pg-promise";

export const register = (app: express.Application) => {
	const oidc = app.locals.oidc;
	const port = parseInt(process.env.PGPORT || "5432", 10);
	const config = {
		databse: process.env.PGDATABASE || "postgres",
		host: process.env.PGHOST || "localhost",
		port,
		user: process.env.PGUSER || "postgres"
	};

	const pgp = pgPromise();
	const db = pgp(config);

	app.get(`/api/games/total`, oidc.ensureAuthenticated(), async (req: any, res) => {
		try {
			const userId = req.userContext.userinfo.sub;
			const total = await db.one(
				`
      SELECT count(*) AS total
      FROM   games
      WHERE  user_id = $[userId]`,
				{ userId },
				(data: { total: number }) => {
					return {
						total: +data.total
					};
				}
			);
			return res.json(total);
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error);
			res.json({ error: error.message || error });
		}
	});

	app.get(`/api/games/find/:search`, oidc.ensureAuthenticated(), async (req: any, res) => {
		try {
			const userId = req.userContext.userinfo.sub;
			const games = await db.any(
				`
      SELECT
          id
          , title
          , genre
          , year
          , company
      FROM   games
      WHERE  user_id = $[userId]
      AND   (title ILIKE $[search] OR genre ILIKE $[search])`,
				{ userId, search: `%${req.params.search}%` }
			);
			return res.json(games);
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error);
			res.json({ error: error.message || error });
		}
	});

	app.post(`/api/games/add`, oidc.ensureAuthenticated(), async (req: any, res) => {
		try {
			const userId = req.userContext.userinfo.sub;
			const id = await db.one(
				`
          INSERT INTO games(user_id, title, genre, year, company)
          VALUES($[userId], $[title], $[genre], $[year], $[company])
          RETURNING id;`,
				{ userId, ...req.body }
			);
			return res.json({ id });
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error);
			res.json({ error: error.message || error });
		}
	});

	app.post(`/api/games/update`, oidc.ensureAuthenticated(), async (req: any, res) => {
		try {
			const userId = req.userContext.userinfo.sub;
			const id = await db.one(
				`
        UPDATE games
        SET title = $[title]
            , genre = $[genre]
            , year = $[year]
            , company = $[company]
        WHERE
            id = $[id]
            AND user_id = $[userId]
        RETURNING
            id;`,
				{ userId, ...req.body }
			);
			return res.json({ id });
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error);
			res.json({ error: error.message || error });
		}
	});

	app.delete(`/api/games/remove/:id`, oidc.ensureAuthenticated(), async (req: any, res) => {
		try {
			const userId = req.userContext.userinfo.sub;
			const id = await db.result(
				`
          DELETE
          FROM   games
          WHERE  user_id = $[userId]
          AND   id = $[id]`,
				{ userId, id: req.params.id },
				(r) => r.rowCount
			);
			return res.json({ id });
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error);
			res.json({ error: error.message || error });
		}
	});
};
