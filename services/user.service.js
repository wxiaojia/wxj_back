// # 获取所有的课程信息
// GET    /course

// # 获取id=1001的课程信息
// GET    /course/1001
// 　　　　/course?id=1001
// # 添加课程信息，请求body中必须包含course的属性数据，json-server自动保存。
// POST   /course

// # 修改课程，请求body中必须包含course的属性数据
// PUT    /course/1
// PATCH  /course/1

// # 删除课程信息
// DELETE /course/1

// 通过账号密码查询用户 /login?account=?&pwd=?
export function findUserByAccountPassword(account, pwd) {
    let message = {
        mes: '通过站好密码查询用户'
    }
    return JSON.stringify(message)
    // return User.findOne({
    //     where: {
    //         account: account,
    //         password: pwd
    //     }
    // })
}
/**
 * 添加用户
 * @param {*} user 用户json对象，{account: xx, password: xx, real_name: xx}
 * @returns 
 */
export function createUser(user) {
    let message = {
        mes: '添加用户'
    }
    return JSON.stringify(message)
    // return User.create(user)
}

/**
 * 根据id查找用户
 * userId
 */
export  function findUser(userId) {
    let message = {
        mes: '根据id查找用户'
    }
    return JSON.stringify(message)
    // return User.findOne({
    //     where: {
    //         id: userId
    //     }
    // })
}

/**
 * 修改用户信息，id- 主键
 * @param {*} user 
 */
export function updateUser(user) {
    let message = {
        data: user,
        mes: '修改用户信息，id'
    }
    return new Promise((resolve, reject) => 
        resolve(JSON.stringify(message))
    )
    // if(user && user.id) {
    //     return User.findByPk(user.id).then(u => {
    //         return u.update(user)
    //     })
    // }
}

export function deleteUser(id) {
    let message = {
        mes: 'deleteUser'
    }
    return JSON.stringify(message)
    // return User.destroy({
    //     where: {
    //         id: id
    //     }
    // })
}

/**
 * 分页
 * @param {*} pageNo 
 * @param {*} pageSize 
 */
export async function findPage(pageNo, pageSize, name) {
    let limit = pageSize
    // 读取数据起始行
    let offset = pageSize * (pageNo  - 1 )
    let result = {}

    if (name) {
        let d = await sequelize.query(`select * from jd_user where account like ? Limit ${offset}, ${limit}`, {
            replacements: ['%' + name + '%'],   // 替换
            model: User         // 转成User类型的
        })
        result.data = d
        
        // 模糊查询的总条数
        d = await sequelize.query(`select count(*) num from jd_user where account like ?`, {
            replacements: ['%' + name + '%']
        })
        if (d && d.length > 0) {
            result.rows = d[0][0].num
            console.log('d', d)     // [[{num: 3}, [num: 3]]]
            result.pages = Math.ceil(d[0][0].num/pageSize)  // 当前第几页
        }

    } else {
        let d = await User.findAll({
            limit: Number(limit),
            offset: Number(offset),     // 从哪开始
            // order: []    // 排序
        })
    
        result.data = d
    
        // 总条数
        d = await sequelize.query("select count(*) num from jd_user")       // 二维数组
        if (d && d.length > 0) {
            result.rows = d[0][0].num
            console.log('d', d)     // [[{num: 3}, [num: 3]]]
            result.pages = Math.ceil(d[0][0].num/pageSize)  // 当前第几页
        }
    }

    
    return result
}

