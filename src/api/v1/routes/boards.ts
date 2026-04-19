import { Router } from 'express';
import { body } from 'express-validator';
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
		.post(
			[
				body('name')
					.trim()
					.notEmpty()
					.withMessage(
						'This is a required field!',
					),
				body('description')
					.trim()
					.notEmpty()
					.withMessage(
						'This is a required field!',
					),
			],
			controller.createBoard.bind(controller),
		);

	router.route('/:boardId')
		.get(controller.getBoardById.bind(controller))
		.put(
			[body('name').trim(), body('description').trim()],
			controller.updateBoard.bind(controller),
		)
		.delete(controller.deleteBoard.bind(controller));

	return router;
};
