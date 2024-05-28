import { Router as _Router } from 'express'
const Router = _Router()
import ctrl from '../controllers/users.js'
import { auth } from '../middleware/auth.js'

Router.post('/register', ctrl.Register)
Router.post('/login', ctrl.Login)

Router.get('/profile', auth(['user', 'admin']), ctrl.GetProfile)
Router.get('/get-users', auth(['user', 'admin']), ctrl.GetUsers)
Router.get('/find-one/:id', auth(['admin']), ctrl.FindOne)

Router.put('/update', auth(['user', 'admin']), ctrl.UpdateUser)

Router.delete('/delete', auth(['user', 'admin']), ctrl.DeleteUser)

export default Router