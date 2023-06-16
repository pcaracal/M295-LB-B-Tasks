import { Application, Request, Response } from 'express';
import express from 'express';
const app: Application = express();
const port = 3000;
const fs = require('fs');
const session = require('express-session');
app.use(express.json());













app.listen(port, () => { console.log(`App is listening to: ${port}`); });