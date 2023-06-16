const fs = require('fs');

export interface Task {
  id: number;
  title: string;
  created_at: number;
  finished_at: number | null;
}
export interface Data {
  next_task_id: number;
  tasks: Task[];
}

export const getTime = () => {
  const d: Date = new Date();
  const h: number = d.getHours();
  const m: number = d.getMinutes();
  const s: number = d.getSeconds();
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};

export const logWithTime = (str: string) => {
  console.log(`${getTime()} - ${str}`);
};

export const getData = async () => {
  return new Promise<Data>((resolve, reject) => {
    fs.readFile('./data.json', (err: Error, data: Buffer) => {
      if (err) reject("Failed to read data");
      else resolve(JSON.parse(data.toString()));
    })
  });
}

export const setData = async (data: Data) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile('./data.json', JSON.stringify(data), (err: Error) => {
      if (err) reject("Failed to write data");
      else resolve();
    })
  });
}

export const findTaskById = (id: number, arr: Task[]) => {
    return arr.find((tsk) => tsk.id === id);
}