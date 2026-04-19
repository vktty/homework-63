import {
	BoardUpdate,
	IBoard,
	IExtendedRequest,
	IRepository,
} from '../interfaces';
import { Forbidden, Notfound, Unauthorized } from '../modules/erros';

type BoardConstructorParams = {
	repository: IRepository;
};

export class BoardService {
	private readonly repository: IRepository;
	constructor({ repository }: BoardConstructorParams) {
		this.repository = repository;
	}
	public async getAll(req: IExtendedRequest) {
		if (!req.user!.id)
			throw new Unauthorized('You are not authorized!');
		const authorId = req.user!.id;

		const boards = await this.repository.findByQuery<IBoard>({
			authorId,
		});
		return boards;
	}
	public async findById(id: string) {
		return this.repository.findById(id);
	}
	public async create(data: IBoard) {
		return this.repository.create(data);
	}
	public async update(id: string, data: BoardUpdate) {
		return this.repository.update(id, data);
	}
	public async delete(id: string) {
		return this.repository.delete(id);
	}
}
