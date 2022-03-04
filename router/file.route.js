// 文件上传下载
import express from 'express'
import fileCtrl from '../controller/file.ctrl.js' 
const router = express.Router()

export default function(app) {

    router.route('/upload').post(fileCtrl.upload)     
    router.route('/merge').post(fileCtrl.merge)     
    router.route('/verify').post(fileCtrl.verify)     

    app.use(router);            
}