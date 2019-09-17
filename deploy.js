const handler = require('serve-handler')
const path = require('path')
const http = require('http')

console.log(path.resolve('./dist'))

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  return handler(request, response, {
    public: path.resolve('./dist') // 网页文件存放处
  })
})

const serverConfig = {
  port: 80, // 监听端口号
  addr: '0.0.0.0' // 监听地址
}

server.listen(serverConfig.port, serverConfig.addr, () => {
  // 开启服务器
  console.log(`Running at http://${serverConfig.addr}:${serverConfig.port}`)
})
