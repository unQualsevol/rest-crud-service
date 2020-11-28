export default interface DataService<T, K> {
	create(data: T): K;

	retrieveAll(): T[];

	retrieve(key: K): T;

	update(key: K, Data: Partial<T>): boolean;

	delete(key: K): boolean;
}
