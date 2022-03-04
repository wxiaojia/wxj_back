// 其他路由
import express from 'express'
import other from '../controller/other.ctrl.js' 
const router = express.Router()

export default function(app) {

    router.route('/request').get(other.request)     
    router.route('/insertReq').get(other.insertReq)     
    router.route('/getManyData').get(other.getManyData)     

    app.use(router);            
}