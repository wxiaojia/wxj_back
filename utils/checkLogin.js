// 拦截器
import isLogin from './isLogin'
import jwt from 'jsonwebtoken'
import Constant from './constant'

let checkLogin = (req, res, next) => {
    // console.log(req.headers)
    // console.log(isLogin(req))
    // console.log(req.headers["access-token"])
    // console.log(req.headers.hasOwnProperty("access-token"))
    // 跨域访问。预请求，放行
    if (req.method === 'OPTIONS') {
        rep.send({})    
    } else if (isLogin(req)) {
        next()
    } else if (req.headers.hasOwnProperty("access-token")) {
        // jwt 解密
        // console.log('是否带有token', req.headers["access-token"])
        jwt.verify(req.headers["access-token"], Constant.Secret, function(err, decode) {
            console.log('错误消息', err, decode)
            if(err) {
                if(err.name === 'JsonWebTokenError') {
                    res.send("token无效，请重新登录!")
                } else if (err.name === 'TokenExpiredError') {
                    // 若token刚过期，可再次重新生成token
                    // 过期时间 = 现在时间 - 过期时间
                    let expiredTime = ((new Date().getTime() - err.expiredAt.getTime()) / (1000 * 60)).toFixed(2)  // 成分钟
                    if (expiredTime < 30) { //  半小时内过期，自动生成新的token
                        // 给前端发送code = 10000（自定义），表示要更新token 
                        res.send("token过期，生成新的token,请重新获取！")
                    } else {
                        res.send("请重新登录!")
                    }
                }
            } else {
                next()
            }
        })
    } else {
        // 无token
        res.send("token不存在，拒绝访问")
    }
  }

  export default checkLogin