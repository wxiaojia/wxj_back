import express from 'express'
const path = require("path");
const fse = require("fs-extra");
const fs = require("fs");
var router = express.Router();
const multiparty = require("multiparty");

const UPLOAD_DIR = path.resolve(__dirname, "../", `fileChunk`)

const pipeStream = (path, writeStream) => {
  console.log('path', path)
  return new Promise((resolve, reject) => {
    // 读取文件，buffer类型
  //读取 路径path的文件内容，并将内容写入到output.txt文件中(原内容会被替换)，并将内容写入到最开始传的filePath中
    const readStream = fse.createReadStream(path)
    // 监听文件读取完毕，会自动触发一次end事件，没有读取完是不会触发的
    try {
      readStream.on("end", () => {
        fse.unlinkSync(path);
        resolve();
      });
      readStream.pipe(writeStream);
    } catch(err) {
      reject(err)
    }
  })
}

// 1、拿到路径
// 2、获取里面的所有切片（数组）
// 3、根据切片顺序合并
// 4、指定位置写入流
const mergeFileChunk = async (filePath, fileName, size) => {
  console.log(fileName)
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`);
  const chunksPath = path.join(UPLOAD_DIR, `${fileName}-chunks`, '/');
  console.log(chunkDir)
  let chunkPaths = null

  // chunkPaths = fs.readdirSync(chunkDir)
  chunkPaths = await fse.readdirSync(chunkDir)
  // console.log(chunkPaths)
  // 根据切片下标进行排序
  // 否则直接读取目录的获得的顺序可能会错乱
  chunkPaths.sort((a, b) => {
    const index = a.split('-').length - 1
    return Number(a.split('-')[index]) - Number(b.split('-')[index])
  })
  // 为什么只读取了一部分？因为前端map里面的promise没有返回，upload还没有返回完就merge
  // console.log(chunkPaths)
  const arr = chunkPaths.map((chunkPath, index) => {
    return pipeStream(
        path.resolve(chunkDir, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(filePath, {
            start: index * size,
            end: (index + 1) * size
        })
    )
  })
  // console.log(arr)
  await Promise.all(arr)
  fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
}

const fileCtrl = {
  upload: (req, res) => {
      const multipart = new multiparty.Form();
      multipart.parse(req, async (err, fields, files) => {
        if (err) {
          console.log('errrrr', err)
          return;
        }
        const [file] = files.file;
        const {fileName, chunkName } = fields;
  
        // 保存切片的文件的路径
        const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
        // 切片目录不存在，创建
        if (!fse.existsSync(chunkDir)) {
          await fse.mkdirs(chunkDir);
        }
        // 把切片移动到切片文件夹
        await fse.move(file.path, `${chunkDir}/${chunkName}`);
        res.end(
          JSON.stringify({
            code: 0,
            message: "切片上传成功"
          })
        )
     })
  },
 
  merge: async (req, res) => {
    // 获得参数
    console.log('/merge 我进来了')
    const { size, fileName} = req.body
    const filePath = path.resolve(UPLOAD_DIR, fileName)
    // 合并
    await mergeFileChunk(filePath, fileName, size)
    res.end(JSON.stringify({
      code: 0,
      message: '文件合并成功'
    }))
  },

  // 秒传功能，接受到文件名时，会判断服务器上是否有这个文件，有的话不执行，返回上传成功
  verify: async (req, res) => {
    // console.log(req.body)
    // 这里可能重名耶？
    const { fileName } = req.body
    const filePath = path.resolve(UPLOAD_DIR, fileName)
    // 返回已经上传切片名列表
    const createUploadedList = async (fileName) => {
      fse.existsSync(path.resolve(UPLOAD_DIR, fileName)) 
        ? fse.readdir(path.resolve(UPLOAD_DIR, fileName))
        : []
    }

    if (fse.existsSync(filePath)) {
      res.end(
          JSON.stringify({
              code: 0,
             message: '不需上传了',
              data: {
                shouldUpload: false   // 不需上传了
              }
          })
      );
    } else {
        res.end(
            JSON.stringify({
                code: 0,
                message: "还是要传滴",
                data: {
                  shouldUpload: true,
                  uploadList: await createUploadedList(`${fileName}-chunks`)
                }
            })
        );
    }
  }
}

export default fileCtrl