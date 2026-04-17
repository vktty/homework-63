import { Router } from 'express';
import { BoardRepository } from '../../../repositories';
import { BoardService } from '../../../services';
import { BoardController } from '../controllers';
import { authVerification } from '../../../middlewares';

export const board = () => {
	const router = Router();
	router.use(authVerification);

	const repository = new BoardRepository();
	const service = new BoardService({ repository });
	const controller = new BoardController({ boardService: service });

	router.route('/')
		.get(controller.getBoards.bind(controller))
		.post(controller.createBoard.bind(controller));

	router.route('/:boardId')
		.get(controller.getBoardById.bind(controller))
		.put(controller.updateBoard.bind(controller))
		.delete(controller.deleteBoard.bind(controller));

	return router;
};
