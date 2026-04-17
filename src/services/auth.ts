import jwt from 'jsonwebtoken';
import {
	IExtendedRequest,
	IRepository,
	IUser,
	UserReturn,
} from '../interfaces';
import { Password } from '../modules';

type AuthConstructorParams = {
	repository: IRepository;
};

export class AuthService {
	private readonly repository: IRepository;

	constructor({ repository }: AuthConstructorParams) {
		this.repository = repository;
	}

	public async createUser(
		req: IExtendedRequest,
		{
			email,
			name,
			password,
		}: Pick<IUser, 'email' | 'name' | 'password'>,
	) {
		const hashedPassword = await Password.hash(password);

		const newUser = {
			id: crypto.randomUUID(),
			name,
			email,
			password: hashedPassword,
			createdAt: new Date().toISOString(),
		};

		const [existingUser] =
			await this.repository.findByQuery<UserReturn>({
				email,
			});

		if (existingUser)
			throw new Error('User with this email already exists!');

		const createdUser = await this.repository.create<IUser, IUser>(
			newUser,
		);

		const token = jwt.sign(
			{ user: { id: newUser.id } },
			process.env.JWT_SECRET!,
			{ expiresIn: '1h' },
		);

		const { password: _, ...userData } = createdUser;

		return { ...userData, token };
	}

	public async getUser(
		req: IExtendedRequest,
		{ email, password }: Pick<IUser, 'email' | 'password'>,
	) {
		const [existingUser] = await this.repository.findByQuery<IUser>(
			{ email },
		);
		if (!existingUser)
			throw new Error("User with this email doen't exist!");
		const result = await Password.verify(
			existingUser.password,
			password,
		);
		const token = jwt.sign(
			{ user: { id: existingUser.id } },
			process.env.JWT_SECRET!,
			{ expiresIn: '1h' },
		);

		const { password: _, ...userData } = existingUser;

		return { ...userData, token };
	}
}
