const fs = require('fs');

export interface Task {
  id: number;
  title: string;
  created_at: number;
  finished_at: number | null;
  fk_user_id: number;
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

export const replaceTaskById = (id: number, arr: Task[], newtask: Task) => {
  return arr.map((tsk) => {
    if (tsk.id === id) return newtask;
    else return tsk;
  });
}

export const deleteTaskById = (id: number, arr: Task[]) => {
  return arr.filter((tsk) => tsk.id != id);
}

export const filterTasksByUserId = (user_id: number, arr: Task[]) => {
  return arr.filter((tsk) => tsk.fk_user_id === user_id);
}


export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Session {
  user?: User;
}

declare global {
  namespace Express {
    interface Request {
      session: Session;
      sessionID: string;
    }
  }
}

export const users: User[] = [
  {
    id: 1,
    email: 'fishcat@cat.com',
    password: 'm295'
  },
  {
    id: 2,
    email: 'hashcat@cat.com',
    password: 'm295'
  },
  {
    id: 3,
    email: 'sandcat@cat.com',
    password: 'm295'
  }
];