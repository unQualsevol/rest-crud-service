
const fs = require("fs");

export function readJsonFile<T>(filePath: string): T[] {
    let rawdata = fs.readFileSync(filePath);
    return JSON.parse(rawdata);
}

export function writeJsonFile<T>(apps: T[], filePath: string) {
    fs.writeFileSync(filePath, JSON.stringify(apps));
}