
import checkLogin from './utils/checkLogin'
import fs from 'fs';        // 读取文件用
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
// http请求中解析body的
import util from 'util'

let app = express()

//     // 暴露app.listen的方法, 把监听的方法延迟
//     app.listenAsync = util.promisify(app.listen)

//     // 配置bodyParser 固定写法
app.use(bodyParser.json())                              // 处理json数据 
app.use(bodyParser.urlencoded({extended: true}))        // 处理表单数据

// 相当于所有接口都拦截到
app.use((req, res, next) => {
    // console.log(req)
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    console.log(`${req.method} ${req.originalUrl}`)
    // 过滤不文明词汇
    if (req.query.content) {
        req.query.content = req.query.content.replace('色情', '**')
    }
    // await next()
    // 不写next的话，2 即不会调到特定的接口，即不会进入下一步
    req.method === 'OPTIONS' ? res.status(204).end() : next()
}) 

// 添加路由
// require(process.cwd() + '/app/router/user.router.js')(app);
// require(process.cwd() + '/app/router/param.router.js')(app);

// 动态加载路由 (加载文件夹中的路由文件)
var current = process.cwd()
var routeDir = current + '/router'
// 同步读取目录下的文件
fs.readdirSync(routeDir).forEach(file => {
    // logger.info("加载了路由" , file)
    console.log(file)
    var filePath = path.join(routeDir, file)
    // 加载并执行
    require(filePath)(app)

})

app.use(checkLogin)

app.listen(process.env.PORT, () => {
    console.log('服务已启动，端口' + process.env.PORT)
})
