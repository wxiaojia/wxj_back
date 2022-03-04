
const jsonServer = require('json-server')
const server = jsonServer.create()
// const UserRoute = require('./router/user.route')
import UserRoute from './router/user.route'
import fileCtrl from './controller/file.ctrl.js'
import other from './controller/other.ctrl.js'
// import FileRoute from './router/file.route'
import checkLogin from './utils/checkLogin'
import bodyParser from 'body-parser'


// const router = jsonServer.router('json/user.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
 // 相当于所有接口都拦截到
 server.use((req, res, next) => {
  console.log('请求了', req.originalUrl, req.method)
  //设置请求头
  res.set({
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Max-Age': 1728000,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    // 'Content-Type': 'application/x-www-form-urlencoded'
  })
  console.log('我是请求拦截，全体可用')
  if (req.method === "OPTIONS") {
    resp.status(200).send()
    return;
  }

 //  console.log(`${req.method} ${req.originalUrl}`)
  // 过滤不文明词汇
 //  if (req.query.content) {
 // 	 req.query.content = req.query.content.replace('色情', '**')
 //  }
  // await next()
  next()
}) 

server.use(jsonServer.rewriter({
  "/user/login\?account=:account\&pwd=:pwd": "/user\?account=:account\&pwd=:pwd"
}))

server.use(jsonServer.bodyParser)
server.use(bodyParser.json())                              // 处理json数据 
server.use(bodyParser.urlencoded({extended: true}))        // 处理表单数据

// 在此添加自定义的路由
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

server.get('/getManyData', (req, res) => {
  let list = []
  let num = 0
    console.log('我是获取很多数据的接口', req.originalUrl)

  for(let i = 0; i < 10000; i++) {
    num++
    list.push({
      src: 'https://p3-passport.byteacctimg.com/img/user-avatar/d71c38d1682c543b33f8d716b3b734ca~300x300.image',
      text: `我是${num}号wxj`,
      tid: num
    })
  }
  const result = {
    code: 200,
    data: list,
    message: '请求成功'
  }
  res.jsonp(result)
})

server.post('/upload',fileCtrl.upload)
server.post('/merge', fileCtrl.merge)
server.post('/verify', fileCtrl.verify)
server.get('/request', other.request)
server.get('/insertReq', other.insertReq)

// 拦截器 token
server.use(checkLogin)

// 给post的请求返回创建时间的属性,可不要的
// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now()
//     console.log('post', req.originalUrl)
//   } else {
//     console.log('我不是post', req.originalUrl)
//   }
//   next()
// })
  UserRoute(server)
  // FileRoute(server)

server.listen(process.env.PORT, () => {
  console.log('JSON Server is running')
})