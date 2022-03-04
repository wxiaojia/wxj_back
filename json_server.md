server.js  express
index.json  json-server

#### json-server 用法
1、http://localhost:3000/db 访问的是db.json文件下的所有内容；
2、http://localhost:3000/layoutList?categoryName= 模拟接口参数可筛选该目录下内容
3、分页查询 参数为 _start, _end, _limit，并可添加其它参数筛选条件
如：http://localhost:3000/posts?_start=6&_limit=3
http://localhost:3000/posts?_start=3&_end=6
4、排序 参数为_sort, _order
如：http://localhost:3000/posts?_sort=id&_order=asc
http://localhost:3000/posts?_sort=user,views&_order=desc,asc
5、操作符 _gte, _lte, _ne, _like
_gte大于，_lte小于， _ne非， _like模糊查询
6、q全局搜索（模糊查询）

如：http://localhost:3000/posts?q-pt

#### 获取所有的课程信息
GET    /course

#### 获取id=1001的课程信息
GET    /course/1001
　　　　/course?id=1001
#### 添加课程信息，请求body中必须包含course的属性数据，json-server自动保存。
POST   /course

#### 修改课程，请求body中必须包含course的属性数据
PUT    /course/1
PATCH  /course/1

#### 删除课程信息
DELETE /course/1

#### 登录接口
1、换接口：get user/login?account=wxj&pwd=123  => user?account=wxj&pwd=123 
2、获取用户之后封装结果，返回含token的对象 {code: 200, messgae: '请求成功', data: {}, token: ''}


接口：
增加 post user?account=wxj&pwd=123  
删 delete user?account
改 put  user?account
查 get  --> 登录，需要token
