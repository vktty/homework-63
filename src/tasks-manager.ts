import express, { NextFunction, Response } from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middlewares';
import { IApp, IExtendedError, IExtendedRequest } from './interfaces';
import { router } from './api/v1/routes';

export const createApp = ({ logFilePath }: IApp) => {
	const staticPath = path.join(__dirname, '..', 'public');
	const app = express();

	app.use('/static', express.static(staticPath));
	app.use(express.json());
	app.use(cookieParser());
	app.use(requestLogger(logFilePath));

	app.get('/', (req: IExtendedRequest, res: Response) => {
		res.status(200).json({
			message: `This is Tasks Manager's home page`,
		});
	});

	app.use('/api/v1', router);

	app.use((req: IExtendedRequest, res: Response, next: NextFunction) => {
		next(new Error(`Route ${req.path} not found!`));
	});

	app.use(
		(
			error: IExtendedError,
			req: IExtendedRequest,
			res: Response,
			next: NextFunction,
		) => {
			const { message, ...arg } = error;
			req.log?.error(`Error occured: ${message}`, arg);
			res.status(error.status || 500).json({
				data: {},
				message,
			});
		},
	);

	return app;
};
