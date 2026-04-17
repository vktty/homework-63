import { Router } from 'express';
import { TaskRepository } from '../../../repositories';
import { TaskService } from '../../../services';
import { TaskController } from '../controllers';
import { authVerification } from '../../../middlewares';

export const tasks = () => {
	const router = Router();
	router.use(authVerification);

	const repository = new TaskRepository();
	const service = new TaskService({ repository });
	const controller = new TaskController({ taskService: service });

	router.route('/')
		.get(controller.getTasks.bind(controller))
		.post(controller.createTask.bind(controller));

	router.route('/:taskId')
		.get(controller.getTaskById.bind(controller))
		.put(controller.updateTask.bind(controller))
		.delete(controller.deleteTask.bind(controller));

	return router;
};
