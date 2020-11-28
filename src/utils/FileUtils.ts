import { readFileSync, writeFileSync } from 'fs';

export function readJsonFile<T>(filePath: string): T[] {
	const rawdata = readFileSync(filePath, 'utf8');
	return JSON.parse(rawdata);
}

export function writeJsonFile<T>(apps: T[], filePath: string): void {
	writeFileSync(filePath, JSON.stringify(apps), 'utf8');
}
