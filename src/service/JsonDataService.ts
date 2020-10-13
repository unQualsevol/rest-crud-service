import DataService from "./DataService";

export interface Identifiable<K> {
  id: K;
}

const fs = require("fs");

export class JsonDataService<T extends Identifiable<K>, K>
  implements DataService<T, K> {
  private readonly path;

  constructor(path: string) {
    this.path = path;
  }

  create(data: T): K {
    let datas = this.retrieveAll();
    datas.push(data);
    this.writeFile(datas);
    return data.id;
  }

  retrieveAll(): T[] {
    return this.readFile();
  }

  retrieve(key: K): T {
    return this.retrieveAll().find((d) => d.id === key);
  }

  update(key: K, data: Partial<T>): boolean {
    let datas = this.retrieveAll();
    let indexOf = datas.findIndex((d) => d.id === key);
    if (indexOf >= 0) {
      datas[indexOf] = { ...datas[indexOf], ...data };
      this.writeFile(datas);
      return true;
    }
    return false;
  }

  delete(key: K): void {
    let datas = this.retrieveAll().filter((d) => d.id !== key);
    this.writeFile(datas);
  }

  private readFile(): T[] {
    let rawdata = fs.readFileSync(this.path);
    return JSON.parse(rawdata);
  }

  private writeFile(data: T[]) {
    fs.writeFileSync(this.path, JSON.stringify(data));
  }
}
