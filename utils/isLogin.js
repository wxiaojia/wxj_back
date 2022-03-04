const isLogin = (req) => {
    // console.log(req.originalUrl)
    // console.log(req.originalUrl.match(reg))
    let reg = /\/user\?account=(\w+)\&pwd=(\w+)/g
    return reg.test(req.originalUrl) && req.method === 'GET'
}

export default isLogin;