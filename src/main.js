import { Router as _Router } from 'express';
const Router = _Router()
import users from './routers/users.js';

Router.use('/users', users)

Router.use((req, res, next) => {
    res.status(404).send("What are you looking for?")
})

export default Router