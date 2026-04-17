import { BoardUpdate, IBoard, IRepository } from '../interfaces';

type BoardConstructorParams = {
	repository: IRepository;
};

export class BoardService {
	private readonly repository: IRepository;
	constructor({ repository }: BoardConstructorParams) {
		this.repository = repository;
	}
	public async getAll() {
		return this.repository.findAll();
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
