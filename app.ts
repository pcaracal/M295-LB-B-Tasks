import { Application, Request, Response } from 'express';
import express from 'express';
import { logWithTime, getData, Data, Task, setData, findTaskById, replaceTaskById, deleteTaskById, users, filterTasksByUserId } from './utils';
const app: Application = express();
const port = 3000;
const session = require('express-session');
app.use(express.json());



// Session endpoints
app.use(
  session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
  })
);

// POST /login: status 200 if success, status 401 if invalid credentials
app.post('/login', async (req: Request, res: Response) => {
  req.session.user = undefined; // Delete old session before new login
  const foundUser = users.find((u) => u.email === req.body.email && u.password === req.body.password);
  if (!foundUser) {
    res.sendStatus(401);
    logWithTime('POST /login not successful, invalid credentials');
  }
  else {
    req.session.user = foundUser;
    res.status(200).send({
      'userID': req.session.user.id,
      'email': req.session.user.email
    });
    logWithTime('POST /login successful')
  }
});

// GET /verify: returns email and status 200 if success, 401 if not logged in
app.get('/verify', async (req: Request, res: Response) => {
  if (req.session.user) {
    res.status(200).send({
      'userID': req.session.user.id,
      'email': req.session.user.email
    });
    logWithTime('GET /verify successful')
  } else {
    res.sendStatus(401);
    logWithTime('GET /verify not successful, not logged in')
  }
});

// DELETE /logout: deletes session and returns status 204
app.delete('/logout', async (req: Request, res: Response) => {
  req.session.user = undefined;
  res.sendStatus(204);
  logWithTime('DELETE /logout successful')
});



// Task endpoints
// GET /tasks: Returns all tasks as JSON and status 200
app.get('/tasks', async (req: Request, res: Response) => {
  if (!req.session.user) {
    res.sendStatus(401);
    logWithTime('GET /tasks not successful, unauthorized')
  }
  else {
    try {
      const data: Data = await getData();
      const userTasks: Task[] = filterTasksByUserId(req.session.user.id, data.tasks);
      res.status(200).send(userTasks);
      logWithTime('GET /tasks successful');
    } catch (error) {
      res.sendStatus(500);
      logWithTime('GET /tasks not successful, server error');
    }
  }
});

// POST /tasks: Creates a new task and returns itself as JSON and status 201; status 406 if title is empty
app.post('/tasks', async (req: Request, res: Response) => {
  if (!req.session.user) {
    res.sendStatus(401);
    logWithTime('POST /tasks not successful, unauthorized');
  }
  else {
    try {
      let data: Data = await getData();
      if (!req.body.title) {
        res.sendStatus(406);
        logWithTime('POST /tasks not successful, missing title in body');
      }
      else {
        let newTask: Task = {
          id: data.next_task_id,
          title: req.body.title,
          created_at: Date.now(),
          finished_at: req.body.finished_at || null,
          fk_user_id: req.session.user.id
        }
        data.next_task_id++;
        data.tasks.push(newTask);

        await setData(data);
        res.status(201).send(newTask);
        logWithTime('POST /tasks successful');
      }
    } catch (error) {
      res.sendStatus(500);
      logWithTime('POST /tasks not successful, server error');
    }
  }
});


// GET /tasks/{id}: Returns a single task by its ID as JSON and status 200 or 404; 400 if no ID is provided
app.get('/tasks/:id', async (req: Request, res: Response) => {
  if (!req.session.user) {
    res.sendStatus(401);
    logWithTime('GET /tasks/{id} not successful, unauthorized');
  }
  else {
    try {
      const data: Data = await getData();
      const userTasks: Task[] = filterTasksByUserId(req.session.user.id, data.tasks);
      if (!req.params.id || isNaN(Number(req.params.id))) {
        res.sendStatus(400);
        logWithTime('GET /tasks/{id} not successful, invalid ID');
      }
      else {
        const foundTask = findTaskById(Number(req.params.id), userTasks);
        if (!foundTask) {
          res.sendStatus(404);
          logWithTime('GET /tasks/{id} not successful, not found');
        }
        else {
          res.status(200).send(foundTask);
          logWithTime('GET /tasks/{id} successful');
        }
      }
    } catch (error) {
      res.sendStatus(500);
      logWithTime('GET /tasks/{id} not successful, server error');
    }
  }
});


// PUT /tasks/{id}: Re-creates a task by its ID and returns new values as JSON and status 200 or 404; status 406 if title is empty
app.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    let data: Data = await getData();
    if (!req.params.id || isNaN(Number(req.params.id))) {
      res.sendStatus(400);
      logWithTime('PUT /tasks/{id} not successful, missing or invalid ID');
    }
    else if (!req.body.title) {
      res.status(406).send('Empty task title');
      logWithTime('PUT /tasks/{id} not successful, missing title in body');
    }
    else {
      let foundTask = findTaskById(Number(req.params.id), data.tasks);
      if (!foundTask) {
        res.sendStatus(404);
        logWithTime('PUT /tasks/{id} not successful, task not found');
      }
      else {
        foundTask.title = req.body.title;
        foundTask.created_at = req.body.created_at || foundTask.created_at;
        if (req.body.finished_at !== undefined) foundTask.finished_at = req.body.finished_at;

        data.tasks = replaceTaskById(Number(req.params.id), data.tasks, foundTask);
        await setData(data);
        res.status(200).send(foundTask);
        logWithTime('PUT /tasks/{id} successful');
      }
    }
  }
  catch (error) {
    res.sendStatus(500);
    logWithTime('PUT /tasks/{id} not successful, server error');
  }
});


// DELETE /tasks/{id}: Deletes a task by its ID and status 204 or 404
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    let data: Data = await getData();
    if (!req.params.id || isNaN(Number(req.params.id))) {
      res.sendStatus(400);
      logWithTime('DELETE /tasks/{id} not successful, missing or invalid ID');
    }
    else {
      if (!findTaskById(Number(req.params.id), data.tasks)) {
        res.sendStatus(404);
        logWithTime('DELETE /tasks/{id} not successful, task not found');
      }
      else {
        data.tasks = deleteTaskById(Number(req.params.id), data.tasks);
        await setData(data);
        res.sendStatus(204);
        logWithTime('DELETE /tasks/{id} successful');
      }
    }
  }
  catch (error) {
    res.sendStatus(500);
    logWithTime('DELETE /tasks/{id} not successful, server error');
  }
});


app.listen(port, () => { console.log(`App is listening to: ${port}`); });