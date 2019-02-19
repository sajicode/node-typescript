import dotenv from "dotenv";
import fs from "fs-extra";
import { Client } from "pg";

const init = async () => {
	// read environment variables
	dotenv.config();
	// create instance of psql client
	const client = new Client();

	try {
		// connect to local database server
		await client.connect();
		// read the contents of the initdb.pgsql
		const sql = await fs.readFile("./tools/initdb.pgsql", { encoding: "UTF-8" });
		// split the file into separate statements
		const statements = sql.split(/;\s*$/m);
		for (const statement of statements) {
			if (statement.length > 3) {
				// execute each of the statements
				await client.query(statement);
			}
		}
	} catch (error) {
		// tslint:disable-next-line:no-console
		console.log(error);
		throw error;
	} finally {
		// close the database client
		await client.end();
	}
};

init()
	.then(() => {
		// tslint:disable-next-line:no-console
		console.log("finished");
	})
	.catch(() => {
		// tslint:disable-next-line:no-console
		console.log("finished with errors");
	});
