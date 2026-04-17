import { NextFunction, Response } from 'express';
import { IExtendedRequest } from '../../../interfaces';
import { BoardService } from '../../../services';

type BoardConstructorParams = {
	boardService: BoardService;
};

export class BoardController {
	private boardService: BoardService;
	constructor({ boardService }: BoardConstructorParams) {
		this.boardService = boardService;
	}
	async getBoards(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		this.boardService
			.getAll()
			.then((boards) => {
				return res
					.status(200)
					.json({ data: boards, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting boards!',
					{ error },
				);
				next(error);
			});
	}
	async getBoardById(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res.status(400).json({
				error: 'Invalid boardId',
			});
		this.boardService
			.findById(boardId)
			.then((board) => {
				return res
					.status(200)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while getting board!',
					{ error },
				);
				next(error);
			});
	}

	async createBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const data = req.body;
		this.boardService
			.create(data)
			.then((board) => {
				return res
					.status(201)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while creating board!',
					{ error },
				);
				next(error);
			});
	}

	async updateBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res.status(400).json({
				error: 'Invalid boardId',
			});
		const data = req.body;
		this.boardService
			.update(boardId, data)
			.then((board) => {
				return res
					.status(200)
					.json({ data: board, error: {} });
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while updating board!',
					{ error },
				);
				next(error);
			});
	}

	async deleteBoard(
		req: IExtendedRequest,
		res: Response,
		next: NextFunction,
	) {
		const { boardId } = req.params;
		if (!boardId || Array.isArray(boardId))
			return res.status(400).json({
				error: 'Invalid boardId',
			});
		this.boardService
			.delete(boardId)
			.then(() => {
				return res.status(200).json({
					data: {},
					error: {},
				});
			})
			.catch((error) => {
				req.log?.error(
					'An error occurred while deleting board!',
					{ error },
				);
				next(error);
			});
	}
}
