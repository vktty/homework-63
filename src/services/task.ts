import { IRepository, ITask, TaskUpdate } from '../interfaces';

type TaskConstructorParams = {
	repository: IRepository;
};

export class TaskService {
	private readonly repository: IRepository;
	constructor({ repository }: TaskConstructorParams) {
		this.repository = repository;
	}
	public async getAll() {
		return this.repository.findAll();
	}
	public async findById(id: string) {
		return this.repository.findById(id);
	}
	public async create(data: ITask) {
		return this.repository.create(data);
	}
	public async update(id: string, data: TaskUpdate) {
		return this.repository.update(id, data);
	}
	public async delete(id: string) {
		return this.repository.delete(id);
	}
}
