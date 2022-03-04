// 用户路由
import express, { response } from 'express'
const router = express.Router()

import userCtl from '../controller/user.ctrl' 

export default function(app) {

    router.route('/user/login').get(userCtl.login)      // ??这种写法--> 多种写法

    app.use(router);            // api前缀
}