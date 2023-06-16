import { Application, Request, Response } from 'express';
import express from 'express';
import { logWithTime } from './utils';
const app: Application = express();
const port = 3000;
const session = require('express-session');
app.use(express.json());


// GET /tasks: Returns all tasks as JSON and status 200
app.get('/tasks', async (req: Request, res: Response) => {

});


// POST /tasks: Creates a new task and returns itself as JSON and status 201; status 406 if title is empty
app.post('/tasks', async (req: Request, res: Response) => {

});


// GET /tasks/{id}: Returns a single task by its ID as JSON and status 200 or 404
app.get('/tasks/:id', async (req: Request, res: Response) => {

});


// PUT /tasks/{id}: Re-creates a task by its ID and returns new values as JSON and status 200 or 404; status 406 if title is empty
app.put('/tasks:id', async (req: Request, res: Response) => {

});


// DELETE /tasks/{id}: Deletes a task by its ID and status 204 or 404
app.delete('/tasks:id', async (req: Request, res: Response) => {

});


app.listen(port, () => { console.log(`App is listening to: ${port}`); });