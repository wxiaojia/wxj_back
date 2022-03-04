


const other = {
    request: (req, res) => {
        const data = req.query.index
        const wait = Math.random() * 5000
        setTimeout(() => {
            res.end(JSON.stringify({
                msg: '我就是推迟请求而已',
                data: data,
                code: 200
            }))
        }, wait)
    },
    insertReq: (req, res) => {
        res.end(JSON.stringify({
            msg: '我是半路请求的，我的优先级更高',
            data: '111',
            code: 200
        }))
    },
    getManyData: (req, res) => {
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
    }
}

export default other