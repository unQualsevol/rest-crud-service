/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from "helmet";

import { JsonDataService } from './service/JsonDataService';

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(bodyParser.json());
app.use(cors({ origin: true }));

type Data = { id: string; active: boolean };

const dataService = new JsonDataService<Data, string>('resources/db.json');

app.post('/data', (req, res) => {
	const data = req.body;
	let dataId;
	try {
		dataId = dataService.create(data);
	} catch (e) {
		res.status(400).send(e.message);
		return;
	}
	if (dataId) {
		res.setHeader('Location', req.path + '/' + dataId);
		res.sendStatus(201);
	} else {
		res.status(409).send(`App '${dataId}' already exists!`);
	}
});

app.get('/data', (req, res) => {
	res.status(200).json(dataService.retrieveAll());
});

app.get('/data/:dataId', (req, res) => {
	const data = dataService.retrieve(req.params.dataId);
	if (data) {
		res.status(200).json(data);
	} else {
		res.status(404).send(`App '${req.params.dataId}' not found!`);
	}
});

app.put('/data/:dataId', (req, res) => {
	if (dataService.update(req.params.dataId, req.body)) {
		res.sendStatus(204);
	} else {
		res.status(404).send(`Data ${req.params.dataId} not found!`);
	}
});

app.delete('/data/:dataId', (req, res) => {
	if (dataService.delete(req.params.dataId)) {
		res.sendStatus(200);
	} else {
		res.status(404).send(`Data ${req.params.dataId} not found!`);
	}
});

/**
 * Server Activation
 */

const server = app.listen(PORT, () => {
	// tslint:disable-next-line:no-console
	console.log(`server started at http://localhost:${PORT}`);
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
	hot?: {
		data: any;
		accept(
			dependencies: string[],
			callback?: (updatedDependencies: ModuleId[]) => void,
		): void;
		accept(dependency: string, callback?: () => void): void;
		accept(errHandler?: (err: Error) => void): void;
		dispose(callback: (data: any) => void): void;
	};
}

declare const module: WebpackHotModule;

if (module.hot) {
	module.hot.accept();
	module.hot.dispose(() => server.close());
}
