import * as userService from '../services/user.service'
import e, { response } from "express"
// import { query } from "winston"
import jwt from "jsonwebtoken"
import Constant from '../utils/constant'

// 用户的接口 控制器 业务逻辑
const userCtrl = {
    generateJwtToken(data) {
        // 生成jwt token (data, 私钥)
        return jwt.sign(data, Constant.Secret, {
            expiresIn: '600000'          // 生效时间，单位 ms， 天 1d - 1天
        })
    },
    login: (req, res) => {
        let data = {
            id: 1000,
            account: "wxj",
            college: "金并即总变史12",
            roles: ["admin"]
        }
        const { account, pwd } =req.query
        if (account === data.account && pwd === '123') {
            let result = {              // 方便使用jwt解出来后能快速得到account或id
                id: data.id,
                account: data.account
            }
            // 生成jwt
            let jwt = userCtrl.generateJwtToken(result)
            res.jsonp({
                message: '请求成功',
                code: 9999,
                data: {
                  data: data,
                  token: jwt
                }
              })
            return
        } else {
            res.jsonp({
                message: '请求成功',
                code: 1000,
                data: '密码错误'
              })
            return
        }
       
    },

    create: function(req, res) {
        const user = req.body
        // 对参数值进行校验
        userService.createUser(user)
            .then(data => {
                let result = {
                    data: data
                }
                resp.status(200).json(result)
            })
            .catch(err =>  {
                resp.status(500).send(err.message())
            })
    },

    query: function(req, res) {
        const userId = req.query.userId
        return userService.findUser(userId).then(data => {
            let result = {
                data: data
            }
            resp.status(200).json(result)
        }).catch(err =>  {
            resp.status(500).send(err.message())
        })
    },
    update: function(req, resp) {
        console.log(req)
        const id = req.query.id
        return userService.updateUser({ id }).then(data => {
            console.log('data', data)
            let result = {
                data: data
            }
            resp.status(200).json(result)
        }).catch(err =>  {
            resp.status(500).send(err.message())
        })
    },
    findPage: function(req, resp) {
        const { pageSize, pageNo, name } = req.query
        return userService.findPage(pageNo, pageSize, name ).then(data => {
            let result = {
                data: data
            }
            resp.status(200).json(result)
        }).catch(err =>  {
            resp.status(500).send(err)
        })
    }
}

export default userCtrl