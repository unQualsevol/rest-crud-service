import DataService from "./DataService";
import {readJsonFile, writeJsonFile} from "../utils/FileUtils";

export interface Identifiable<K> {
  id: K;
}

export class JsonDataService<T extends Identifiable<K>, K>
  implements DataService<T, K> {
  constructor(private readonly path: string) {}

  create(data: T): K {
    this.validateData(data);
    const dataArray = this.retrieveAll();
    if(this.findById(data.id, dataArray)){
      return undefined;
    }
    dataArray.push(data);
    writeJsonFile(dataArray, this.path);
    return data.id;
  }

  retrieveAll(): T[] {
    return readJsonFile(this.path);
  }

  retrieve(key: K): T {
    return this.findById(key, this.retrieveAll());
  }

  update(key: K, data: Partial<T>): boolean {
    let dataArray = this.retrieveAll();
    let indexOf = dataArray.findIndex((d) => d.id === key);
    if (indexOf >= 0) {
      dataArray[indexOf] = { ...dataArray[indexOf], ...data };
      writeJsonFile(dataArray, this.path);
      return true;
    }
    return false;
  }

  delete(key: K): boolean {
    let dataArray = this.retrieveAll();
    let filteredData = dataArray.filter((d) => d.id !== key);
    writeJsonFile(filteredData, this.path)
    return dataArray.length - filteredData.length > 0;
  }

  private findById(id: K, dataArray:T[]): T {
    return dataArray.find((a) => a.id === id);
  }

  private validateData(data: T) {
    if (!data.id) {
      throw Error("Missing id.");
    }
  }
}
